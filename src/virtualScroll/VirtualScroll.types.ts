import { ReactNode } from 'react';

export interface VirtualScrollProps {
    /**
     * Callback function triggered when scrolling to the bottom of the component.
     */
    onScrollToBottom?: () => void;

    elementHeight: number;
    /**
     * Content to be rendered within the component.
     */
    children?: ReactNode | string | number;

    /**
     * Height of the viewport in px, eg: 400px
     */
    viewportHeight: string | number | undefined;

    /**
     * Width of the component in px, eg: 400px
     */
    width?: string | number | undefined;

    /**
     * CSS class name for styling the component.
     */
    className?: string;

    /**
     * This specifies the number of items to load when the component first renders.
     */
    loadedItems?: number;

    /**
     * When true, it will show the loading effect as the user scrolls the list items.
     * @defaultValue true
     */
    loadingEffectOnScrolling?: boolean;

    /**
     * When true, it will show a loader when user scolls to the bottom of the list.
     * It can be toggled from the parent component.
     * @defaultValue false
     */
    loaderOnScrollingBottom?: boolean;

    /**
     * Count of number of rows in the bottom default loader.
     * @defaultValue 0
     * If @param customLoaderTemplate is provided, then @param defaultBottomLoaderCount default loader will not work.
     */
    defaultBottomLoaderCount?: number;

    /**
     * Custom template for the bottom scroll loader.
     * If @param customLoaderTemplate is provided, then @param defaultBottomLoaderCount default loader will not work.
     */
    customLoaderTemplate?: ReactNode;

    /**
     * Name of key which holds the value of ref for the first item in the list.
     * Example: ref, containerRef, myDivRef
     * Required to calculate the height of item.
     */
    itemRefPropertyName?: string;

    /**
     * Callback to get the reference of Viewport container.
     * It can be used to control the scroll from parent component.
     */
    getViewportElement?: (viewPort: HTMLElement) => void;
}

export interface DynamicHeight {
    /**
     * height is based on the no of elements inside the scroll
     */
    height?: string;
}
