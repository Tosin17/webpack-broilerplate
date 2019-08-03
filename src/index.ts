import { hi } from './hello-world';
import './css/main.scss';
import '../common/styles.scss';
import './index.html';

console.log(hi());

export function removeSpace(str: string) {
    return str.replace(/ /g, '');
}

removeSpace('Yo man !! ...');