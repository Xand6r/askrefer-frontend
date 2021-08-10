import { Link } from 'react-router-dom';
import './styles.scss';
import Logo from '@/assets/logo';

export default function NavBar() {
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
