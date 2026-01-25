export namespace models {
	
	export class Ingredient {
	    name: string;
	    quantity: number;
	    unit: string;
	
	    static createFrom(source: any = {}) {
	        return new Ingredient(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.quantity = source["quantity"];
	        this.unit = source["unit"];
	    }
	}

}

