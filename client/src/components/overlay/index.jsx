import { useRef } from 'react';
import { useClickAway } from 'react-use';
import './styles.scss';

export default function Index({
    open, toggleOpen, component: Component
}) {
    const overlayRef = useRef(null);
    const className = `${open ? "" : "--hidden"}`;

    // when they click away from the overlay itself, hide it
    useClickAway(overlayRef, toggleOpen);
    return (
        <div class={className} id="overlay-component">
            <div ref={overlayRef} className="overlay-component__slider">
                <Component />
            </div>
        </div>
    )
}
