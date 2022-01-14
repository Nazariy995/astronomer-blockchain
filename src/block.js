const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {

	constructor(data){
		this.hash = null;                                           // Hash of the block
		this.height = 0;                                            // Block Height (consecutive number of each block)
		this.body = Buffer.from(JSON.stringify(data)).toString('hex');   // Will contain the transactions stored in the block, by default it will encode the data
		this.time = 0;                                              // Timestamp for the Block creation
		this.previousBlockHash = null;                              // Reference to the previous Block Hash
    }
    
    validate() {
        let self = this;
        return new Promise((resolve, reject) => {
            // Save in auxiliary variable the current block hash
            let currentHash = self.hash;          
            // Recalculate the hash of the Block
            let recalcHash = SHA256(JSON.stringify(self)).toString();
            // Comparing if the hashes changed
            // Returning the Block is not valid
            if(recalcHash == currentHash) {
                resolve(true);
            } else {
                resolve(false);
            }
            // Returning the Block is valid
        });
    }

    getBData() {
        // Getting the encoded data saved in the Block
        let self = this;
        return new Promise((resolve, reject) => {
            let data = self.body;
            let decodedData = hex2ascii(data);
            let parsedData = JSON.parse(decodedData);
            // Decoding the data to retrieve the JSON representation of the object
            // Parse the data to an object to be retrieve.
            if(self.height > 0 ){
                resolve(parsedData);
            } else {
                reject(new Error("Cannot return Genesis block"))
            }
            // Resolve with the data if the object isn't the Genesis block
        });
        

    }

}

module.exports.Block = Block;         