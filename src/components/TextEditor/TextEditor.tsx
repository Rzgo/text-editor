import React, { useState } from 'react'
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js'
import { getCurrentBlock } from './handlers'
import { BlockType, IContentBlock, ISlideData } from './types'

import styles from './styles.module.css'
import 'draft-js/dist/Draft.css'

export const TextEditor: React.FC = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )

  const toggleBlockType = (selectedType: string) => {
    const contentState = editorState.getCurrentContent()

    const { blockType } = getCurrentBlock(editorState, contentState)

    if (selectedType !== blockType) {
      setEditorState(RichUtils.toggleBlockType(editorState, selectedType))
    }
  }

  const handleEditorChange = (state: EditorState) => {
    const contentState = state.getCurrentContent()
    const rawContent = convertToRaw(contentState).blocks
    const { blockType, blockKey } = getCurrentBlock(state, contentState)
    const currentIndex = rawContent.findIndex((item) => item.key === blockKey)

    const contentLength = rawContent.length
    const lastBlock = rawContent[contentLength - 1]

    const firstBlockIsNotH1 = rawContent[0]?.type !== BlockType.h1
    const secondBlockIsNotH2 = rawContent[1]?.type !== BlockType.h2
    const thirdBlockIsNotBullet = rawContent[2]?.type !== BlockType.li
    const penultimateBlockIsH2 =
      rawContent[rawContent.length - 2]?.type === BlockType.h2

    const lastBlockIsNotBullet = lastBlock?.type !== BlockType.li
    const lastBlockIsUnstyled = lastBlock?.type === BlockType.unstyled

    const previousSelectedBlockIsH2 =
      rawContent[currentIndex - 1]?.type === BlockType.h2
    const selectedBlockIsH2 = blockType === BlockType.h2

    if (contentLength === 1 && firstBlockIsNotH1) {
      setEditorState(RichUtils.toggleBlockType(state, BlockType.h1))
    } else if (contentLength === 2 && secondBlockIsNotH2) {
      setEditorState(RichUtils.toggleBlockType(state, BlockType.h2))
    } else if (
      (contentLength === 3 && thirdBlockIsNotBullet) ||
      (penultimateBlockIsH2 && lastBlockIsNotBullet) ||
      lastBlockIsUnstyled ||
      (previousSelectedBlockIsH2 && selectedBlockIsH2)
    ) {
      setEditorState(RichUtils.toggleBlockType(state, BlockType.li))
    } else {
      setEditorState(state)
    }
  }

  const onBlur = () => {
    const contentState = editorState.getCurrentContent()
    const rawContent = convertToRaw(contentState)

    const contentBlocks: IContentBlock[] = []
    let currentHeading = ''

    rawContent.blocks.forEach((block, index) => {
      const { type, text } = block
      if (index === 0) {
        currentHeading = text
      } else if (type === BlockType.h2) {
        contentBlocks.push({
          heading: text || '',
          bullets: [],
        })
      } else if (type === BlockType.li) {
        if (contentBlocks[contentBlocks.length - 1]) {
          contentBlocks[contentBlocks.length - 1].bullets.push(text)
        } else {
          contentBlocks.push({
            heading: '',
            bullets: [text],
          })
        }
      }
    })

    const slideData: ISlideData = {
      title: currentHeading,
      content_blocks: contentBlocks,
    }
    console.log(JSON.stringify(slideData, null, 2))
  }

  return (
    <div>
      <div className={styles.root} onBlur={onBlur}>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="Add a title for your slide…"
        />
      </div>
      <div className={styles.buttonWrapper}>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            toggleBlockType(BlockType.h2)
          }}
        >
          Heading
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            toggleBlockType(BlockType.li)
          }}
        >
          Bullet
        </button>
      </div>
    </div>
  )
}
