import { ContentState, EditorState } from 'draft-js'

export const getCurrentBlock = (
  editorState: EditorState,
  contentState: ContentState
) => {
  const selectionState = editorState.getSelection()
  const blockKey = selectionState.getStartKey()
  const currentBlock = contentState.getBlockForKey(blockKey)
  const blockType = currentBlock.getType()

  return { currentBlock, blockKey, blockType }
}
