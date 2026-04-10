import type { PropsWithChildren } from "react";

/**
 * Using ComboboxContext
 * - items (options)
 * - selectedValue
 * - onOptionSelected
 * - searchValue
 * - isOpen
 * - setIsOpen
 */
export function Combobox({ items }: PropsWithChildren<{ items: any[] }>) {
    // event listener to close combobox when click outside
    return <ContextProvider value={{ items }}></ContextProvider>
}

export function ComboboxInput() {
    // const { onClick } = useContext(ComboboxContent)

    // onClick handles visibility of ComboboxContent (popover)

    return <div><input ... /><div className="chevron thingy" onClick={onClick}></div></div>
}

export function ComboboxContent() {
    // const {isOpen} = useContext(ComboboxContent)
}

export function ComboboxList({ children }) {
    const { items, searchValue } = useContext(ComboboxContext)

    // filtering based on searchValue

    return <>
        {items.map(item => children(item))}
    </>;
}

export function ComboboxEmpty() {

}
