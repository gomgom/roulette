import './localization';
import options from './options';
import { Roulette } from './roulette';

(window as any).roulette = new Roulette();
(window as any).options = options;
