import {
    extend,
    uniqueId,
    each
} from 'underscore';



export default class BoxImagePicker {

    Selector: string;
    Options = {
        hide_select: true,
        box_size: 200
    };
    
    SelectElement: HTMLSelectElement;
    ParentElement: HTMLElement;

    SelectedIndex: number;


    /**
     * Create a new BoxImagePicker
     * @param select_id Element query selector string
     * @param options Options to override the default options
     */
    constructor(selector: string, options?: object) {
        if (typeof selector != 'string') {
            throw new Error('Selector must be a string');
        }

        this.Selector = selector;

        this.SelectElement = selector[0] == "#" ?
            document.getElementById(this.Selector.substr(1)) as HTMLSelectElement :
            document.querySelector(this.Selector) as HTMLSelectElement;
        
        let defaultOptions = this.Options;
        this.Options = options ?
            extend(defaultOptions, options) :
            defaultOptions;
        
        this.BuildBoxes();
    }


    BuildBoxes = () => {
        this.ParentElement = document.createElement('div');
        this.ParentElement.id = `boximagepicker-${uniqueId()}`;

        this.appendAfter(this.ParentElement, this.SelectElement);

        if (this.Options.hide_select) {
            this.SelectElement.style.display = 'none';
        }

        let $options = this.SelectElement.querySelectorAll('option');

        each($options, ($option, index) => {
            let $box = this.BuildSingleBox($option, index);
            this.ParentElement.appendChild($box);
        });

        this.SelectElement.addEventListener('change', () => {
            this.SelectedIndex = this.SelectElement.selectedIndex;
            this.UpdateSelected();
        });
    }


    BuildSingleBox = ($option: HTMLElement, index: number): HTMLElement => {
        let $box = document.createElement('div');
        $box.className = 'boximagepicker__box';
        $box.style.backgroundImage = `url(${$option.getAttribute('data-img-src')})`;
        $box.style.width = `${this.Options.box_size}px`;
        $box.style.height = `${this.Options.box_size}px`;

        $box.addEventListener('click', () => {
            this.SelectedIndex = index;
            this.SelectElement.selectedIndex = index;
            this.UpdateSelected();
        });

        return $box;
    }


    UpdateSelected = (): void => {
        // First, clear any selected boxes
        let $boxes = this.ParentElement.querySelectorAll('.boximagepicker__box');

        each($boxes, ($box) => {
            $box.classList.remove('boximagepicker__box--selected');
        });

        // Now mark the correct one as "selected"
        $boxes[this.SelectedIndex].classList.add('boximagepicker__box--selected');
    }


    /**
     * @see https://plainjs.com/javascript/manipulation/insert-an-element-after-or-before-another-32/
     */
    private appendAfter = (el: HTMLElement, referenceNode: HTMLElement) => {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }
    
}
