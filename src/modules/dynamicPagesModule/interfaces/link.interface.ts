import { ValidationSchema } from 'class-validator';

export interface Link {
    label: string;
    menu: string;
    permission?: string;
    subMenu?: Link[];
    link?: string;
    parameter?: string[];
}
