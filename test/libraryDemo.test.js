const LibraryDemo = artifacts.require("./LibraryDemo.sol")
const { toUTF8Array, hex_to_ascii } = require('../helpers');


contract('TestLibraryDemo', accounts => {
  beforeEach(async () => {
    libraryDemo = await LibraryDemo.new();
  });
   it('should get full name', async () => {
     const fullName = await libraryDemo.getFullName(
       toUTF8Array('Mr.'),
       toUTF8Array('Jesse'),
       toUTF8Array('Wicks')
     );
     const expectedFullName = 'Mr. Jesse Wicks';
     expect(hex_to_ascii(fullName)).to.equal(expectedFullName);
   });

   it('should get the title', async () => {
     const title = await libraryDemo.getTitle(
       toUTF8Array('Mr. Jesse Wicks')
     );
     const expectedTitle = "Mr.";
     expect(hex_to_ascii(title)).to.equal(expectedTitle);
   });
})