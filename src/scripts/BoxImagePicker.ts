import {
    extend,
    uniqueId,
    each
} from 'underscore';



export default class BoxImagePicker {

    private Selector: string;
    private Options = {
        hide_select: true,
        box_size: 150,
        spacing: 5,
        border_size: 5,
    };
    
    private SelectElement: HTMLSelectElement;
    private ParentElement: HTMLElement;

    private SelectedIndex: number = 0;


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
        this.UpdateSelected();
    }


    private BuildBoxes = () => {
        this.ParentElement = document.createElement('div');
        this.ParentElement.id = `boximagepicker-${uniqueId()}`;
        this.ParentElement.className = 'boximagepicker';

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


    private BuildSingleBox = ($option: HTMLElement, index: number): HTMLElement => {
        let $container = document.createElement('div');
        $container.className = 'boximagepicker__box-container';

        let $box = document.createElement('div');
        $box.className = 'boximagepicker__box-container__box';
        $box.style.width = `${this.Options.box_size}px`;
        $box.style.height = `${this.Options.box_size}px`;
        $box.style.padding = `${this.Options.spacing}px`;

        $box.addEventListener('click', () => {
            this.SelectedIndex = index;
            this.SelectElement.selectedIndex = index;
            this.UpdateSelected();
        });

        let $imagecontainer = document.createElement('div');
        $imagecontainer.className = 'boximagepicker__box-container__box__image-container';
        $imagecontainer.style.borderWidth = `${this.Options.border_size}px`;

        let $image = document.createElement('div');
        $image.className = 'boximagepicker__box-container__box__image-container__image';
        $image.style.backgroundImage = `url(${$option.getAttribute('data-img-src')})`;
        $image.style.width = `${this.Options.box_size-(this.Options.spacing*2)-(this.Options.border_size*2)}px`;
        $image.style.height = `${this.Options.box_size-(this.Options.spacing*2)-(this.Options.border_size*2)}px`;

        $imagecontainer.appendChild($image);
        $box.appendChild($imagecontainer);
        $container.appendChild($box);

        return $container;
    }


    private UpdateSelected = (): void => {
        // First, clear any selected boxes
        let $boxes = this.ParentElement.querySelectorAll('.boximagepicker__box-container__box');

        each($boxes, ($box) => {
            $box.classList.remove('boximagepicker__box-container__box--selected');
        });

        // Now mark the correct one as "selected"
        $boxes[this.SelectedIndex].classList.add('boximagepicker__box-container__box--selected');
    }


    /**
     * @see https://plainjs.com/javascript/manipulation/insert-an-element-after-or-before-another-32/
     */
    private appendAfter = (el: HTMLElement, referenceNode: HTMLElement) => {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }


    public getSelected = () => {
        var res = {
            index: this.SelectedIndex,
            value: this.SelectElement.querySelectorAll('option')[this.SelectedIndex].value,
        };

        return res;
    }
    
}
