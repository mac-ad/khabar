// Icon exports - add new icons here
// Icons from https://lineicons.com/free-icons

export { default as Home } from './Home2';
export { default as HomeFilled } from './Home2filled';
export { default as Bookmark } from './Bookmark1';
export { default as BookmarkFilled } from './Bookmark1filled';
export { default as Moon } from './MoonHalfRight5';
export { default as MoonFilled } from './MoonHalfRightfilled';

// Icon component type - all icons should accept these props
export type IconComponent = React.FC<{ 
  width?: number; 
  height?: number; 
  color?: string;
}>;
