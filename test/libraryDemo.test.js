const LibraryDemo = artifacts.require("./LibraryDemo.sol")

function string2Bin(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}
function bin2String(array) {
  return String.fromCharCode.apply(String, array);
}
contract('TestLibraryDemo', accounts => {
  beforeEach(async () => {
    libraryDemo = await LibraryDemo.new();
  });
   it('should get full name', async () => {
     const fullName = await libraryDemo.getFullName(string2Bin('Mr.'), string2Bin('Jesse'), string2Bin('Wicks'));
     const expectedFullName = 'Mr. Jesse Wicks';
     expect(bin2String(fullName)).to.equal(expectedFullName);
   });

   it('should get the title', async () => {
     const title = await libraryDemo.getTitle(string2Bin("Mr. Jesse Wicks"));
     const expectedTitle = "Mr.";
     expect(bin2String(title)).to.equal(expectedTitle);
   });
})