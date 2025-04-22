export const exposeDuplicateDocumentFunction = `
function duplicateDocument() {
  const idDplc = charIDToTypeID("Dplc");
  const desc  = new ActionDescriptor();
  const idnull = charIDToTypeID("null");
  const ref   = new ActionReference();

  ref.putEnumerated(
      charIDToTypeID("Dcmn"),
      charIDToTypeID("Ordn"),
      charIDToTypeID("Trgt")
  );

  desc.putReference(idnull, ref);
  executeAction(idDplc, desc, DialogModes.NO);
}
`;
