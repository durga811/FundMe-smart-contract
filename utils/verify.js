const { run } = require("hardhat");

async function verify(contractAdress, arg) {
   console.log("verifying");
   try {
      await run("verify:verify", {
         address: contractAdress,
         constructorArguments: arg,
      });
   } catch (error) {
      if (error.message.toLowerCase().includes("already verified")) {
         console.log("already verified");
      } else {
         console.log(error);
      }
   }
}
module.exports = { verify };
