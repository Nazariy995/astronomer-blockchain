
const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain {

    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    async initializeChain() {
        if( this.height === -1){
            let block = new BlockClass.Block({data: 'Genesis Block'});
            await this._addBlock(block);
        }
    }

    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    _addBlock(block) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                block.height = self.chain.length;
                block.time = new Date().getTime().toString().slice(0,-3);
                if(self.chain.length > 0){
                    block.previousBlockHash = self.chain[self.chain.length - 1].hash;
                }
    
                block.hash = SHA256(JSON.stringify(block)).toString();
                self.chain.push(block);
                self.height++;
                resolve(block);
            } catch (error) {
                reject(error)
            }
        });
    }

    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            resolve(`${address}:${new Date().getTime().toString().slice(0,-3)}:starRegistry`)
        });
    }

    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            let messageTime = parseInt(message.split(':')[1]);
            let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
            if(currentTime - messageTime < 300){
                let verified = bitcoinMessage.verify(message, address, signature);
                if(verified){
                    let newBlock = new BlockClass.Block({"star": star, "owner": address});
                    self._addBlock(newBlock);
                    resolve(newBlock);
                } else {
                    reject("Not Verified")
                }

            } else {
                reject("Too much time elapsed")
            }
            
        });
    }


    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve, reject) => {
            const foundHash = self.chain.filter(block => block.hash == hash);
            if(foundHash.length > 0){
                resolve(foundHash[0])
            } else {
                reject("Not Found")
            }
        });
    }


    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }


    getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];
        return new Promise((resolve, reject) => {
            self.chain.forEach(async(block)=>{
                try {
                    const data = await block.getBData();
                    const owner = data.owner;
                    if(owner == address){
                        stars.push(data.star)
                    }
                } catch(error){
                    console.log(error);
                }
            })
            resolve(stars);
        });
    }


    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            self.chain.forEach(async(block)=>{
                await block.validate().then((result)=>{
                    if(result === false){
                        errorLog.push(new Error(`${block.hash} is not valid`))
                    }
                })
            })
            
        });
    }

}

module.exports.Blockchain = Blockchain;   