import { Link } from 'react-router-dom';
import './styles.scss';
import Logo from '@/assets/logo';
import { useEffect } from 'react';
import { showSuccessToast } from '@/utilities';

export default function NavBar() {

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const message = query.get("message");
        showSuccessToast(message);
    }, []);

    return (
        <div id="navbar-wrapper">
            <nav>
                <Link to="/">
                    <Logo />
                </Link>
            </nav>
        </div>
    )
}
