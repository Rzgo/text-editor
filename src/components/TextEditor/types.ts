export enum BlockType {
  h1 = 'header-one',
  h2 = 'header-two',
  li = 'unordered-list-item',
  unstyled = 'unstyled',
}

export interface IContentBlock {
  heading: string
  bullets: string[]
}

export interface ISlideData {
  title: string
  content_blocks: IContentBlock[]
}
