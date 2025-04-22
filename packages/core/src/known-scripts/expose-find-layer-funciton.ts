export const exposeFindLayerFunction = `
function findLayer(layers, indexPath) {
  if (indexPath.length < 1) {
    return null;
  }

  const nextIndex = indexPath[0];
  if (layers.length <= nextIndex) {
    return null;
  }

  const layer = layers[nextIndex];
  if (indexPath.length === 1) {
    return layer;
  }

  if (layer.typename === "LayerSet") {
    const nextIndexPath = [];
    for (let i = 1; i < indexPath.length; i++) {
      nextIndexPath.push(indexPath[i]);
    }

    const subLayer = findLayer(layer.layers, nextIndexPath);
    return subLayer;
  }

  return null;
}
`;
