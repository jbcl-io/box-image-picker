import {
    extend,
    uniqueId,
    each
} from 'underscore';



export default class BoxImagePicker {

    private Selector: string;
    private Options = {
        hide_select: true,
        grid_col: 4,
        spacing: 5,
        border_size: 5,
        show_label: false,
        onSelect: function(index: number, value: string) {}
    };

    private SelectElement: HTMLSelectElement;
    private ParentElement: HTMLElement;

    private SelectedIndex: number = 0;

    private emptyOptionIndex?: number;


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

        this.SelectedIndex = this.getSelectedIndex();

        this.BuildBoxes();
        this.UpdateSelected();

        window.addEventListener('resize', () => {
            this.UpdateBoxWidths();
            this.UpdateBoxHeights();
        });
    }


    private getSelectedIndex = (): number => {
        return this.SelectElement.selectedIndex;
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

        this.UpdateBoxWidths();
        this.UpdateBoxHeights();

        this.SelectElement.addEventListener('change', () => {
            this.SelectedIndex = this.SelectElement.selectedIndex;
            this.onChange();
        });
    }


    private BuildSingleBox = ($option: HTMLElement, index: number): HTMLElement => {
        let $container = document.createElement('div');
        $container.className = 'boximagepicker__box-container';

        let $box = document.createElement('div');
        $box.className = 'boximagepicker__box-container__box';
        $box.style.padding = `${this.Options.spacing}px`;

        if ($option.getAttribute('value') == null) {
            this.emptyOptionIndex = index;
            $box.style.display = 'none';
        } else {
            $box.addEventListener('click', () => this.onBoxClick(index));

            let $imagecontainer = document.createElement('div');
            $imagecontainer.className = 'boximagepicker__box-container__box__image-container';
            $imagecontainer.style.borderWidth = `${this.Options.border_size}px`;

            let $image = document.createElement('div');
            $image.className = 'boximagepicker__box-container__box__image-container__image';
            $image.style.backgroundImage = `url(${$option.getAttribute('data-img-src')})`;

            $imagecontainer.appendChild($image);
            $box.appendChild($imagecontainer);
        }

        $container.appendChild($box);

        if (this.Options.show_label) {
            let $label = this.BuildBoxLabel($option.textContent);
            $container.appendChild($label);
        }

        return $container;
    }


    private BuildBoxLabel = (label: string): HTMLElement => {
        let $labelContainer = document.createElement('div');
        let $label = document.createElement('span');

        $labelContainer.classList.add('boximagepicker__box-container__label');
        $labelContainer.style.paddingLeft = `${this.Options.spacing*2}px`;
        $labelContainer.style.paddingRight = `${this.Options.spacing*2}px`;
        $labelContainer.style.paddingBottom = `${this.Options.spacing*2}px`;

        $label.textContent = label;

        $labelContainer.appendChild($label);

        return $labelContainer;
    }


    private onBoxClick = (index: number): void => {
        if (index === this.SelectedIndex && this.emptyOptionIndex !== undefined) {
            index = this.emptyOptionIndex;
        }

        this.SelectedIndex = index;
        this.SelectElement.selectedIndex = index;
        this.onChange();
    }


    private onChange = (): void => {
        this.UpdateSelected();

        // Trigger user's callback
        if (typeof this.Options.onSelect == 'function') {
            let res = this.getSelected();
            this.Options.onSelect(res.index, res.value);
        }
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


    private UpdateBoxWidths = (): void => {
        let $boxes = this.ParentElement.querySelectorAll('.boximagepicker__box-container__box');

        let column_width = this.ParentElement.clientWidth / this.Options.grid_col;

        each($boxes, ($box) => {
            ($box as HTMLElement).style.width = `${column_width}px`;
        });

        // Update label max-width
        if (this.Options.show_label) {
            let $labels = this.ParentElement.querySelectorAll('.boximagepicker__box-container__label');

            each($labels, ($label) => {
                ($label as HTMLElement).style.width = `${column_width}px`;
            });
        }
    }


    private UpdateBoxHeights = (): void => {
        let $boxes = this.ParentElement.querySelectorAll('.boximagepicker__box-container__box');

        each($boxes, ($box) => {
            let box_height = $box.clientWidth;
            ($box as HTMLElement).style.height = `${box_height}px`;

            let imagecntr_height = box_height - (this.Options.spacing*2) - (this.Options.border_size*2);
            ($box.querySelector('.boximagepicker__box-container__box__image-container') as HTMLElement).style.height = `${imagecntr_height}px`;
            ($box.querySelector('.boximagepicker__box-container__box__image-container__image') as HTMLElement).style.height = `${imagecntr_height}px`;
        });
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
            value: this.SelectElement.querySelectorAll('option')[this.SelectedIndex].getAttribute('value'),
        };

        return res;
    }

}
