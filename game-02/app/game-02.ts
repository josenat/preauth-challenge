// Clase base Item
//-----------------------------------------------------------------------------
export class Item {
    name    : string;
    sellIn  : number;
    quality : number;

    constructor(name, sellIn, quality) {
        this.name    = name;
        this.sellIn  = sellIn;
        this.quality = quality;
    }
}


// Interfaz para todas las estrategias de actualización
//-----------------------------------------------------------------------------
interface CustomUpdate {
    update(item: Item);
}


// Clase base con métodos auxiliares
//-----------------------------------------------------------------------------
abstract class ItemChanger implements CustomUpdate {
    constructor(protected item: Item) {}

    abstract update();

    protected increaseQuality(amount: number = 1) {
        this.item.quality = Math.min(this.item.quality + amount, 50);
    }

    protected decreaseQuality(amount: number = 1) {
        this.item.quality = Math.max(this.item.quality - amount, 0);
    }

    protected decreaseSellIn() {
        this.item.sellIn -= 1;
    }
}


// Implementación de la estrategia para los ítems normales
//-----------------------------------------------------------------------------
class NormalItemChanger extends ItemChanger {
    update() {
        this.decreaseQuality();
        this.decreaseSellIn();
        if (this.item.sellIn < 0) {
            // Se degrada 2 veces más rápido después de la fecha de venta
            this.decreaseQuality(); 
        }
    }
}


// Estrategia para Aged Brie (Brie añejo)
//-----------------------------------------------------------------------------
class AgedBrieChanger extends ItemChanger {
    update() {
        this.increaseQuality();
        this.decreaseSellIn();
        if (this.item.sellIn < 0) {
            // Aumenta más rápido después de la fecha de venta
            this.increaseQuality(); 
        }
    }
}


// Estrategia para Backstage passes
//-----------------------------------------------------------------------------
class BackstagePassesChanger extends ItemChanger {
    update() {
        if (this.item.sellIn > 10) {
            this.increaseQuality();
        
        } else if (this.item.sellIn > 5) {
            this.increaseQuality(2);

        } else if (this.item.sellIn > 0) {
            this.increaseQuality(3);

        } else {
            // Después del concierto, la calidad es 0
            this.item.quality = 0; 
        }

        this.decreaseSellIn();
    }
}


// Estrategia para Sulfuras
//-----------------------------------------------------------------------------
class SulfurasChanger extends ItemChanger {
    update() {
        // Sulfuras no cambia ni su sellIn ni su calidad
    }
}


// Estrategia para ítems 'Conjurados'
//-----------------------------------------------------------------------------
class ConjuredItemChanger extends ItemChanger {
    update() {
        this.decreaseQuality(2);
        this.decreaseSellIn();
        if (this.item.sellIn < 0) {
            // Se degrada 2 veces más rápido después de la fecha de venta
            this.decreaseQuality(2);
        }
    }
}


// Factoría para seleccionar la estrategia correcta
//-----------------------------------------------------------------------------
class ItemChangerFactory {
    static nameList = {
        agedBrie        : 'Aged Brie',
        backstagePasses : 'Backstage passes to a TAFKAL80ETC concert',
        sulfuras        : 'Sulfuras, Hand of Ragnaros',
        conjured        : 'Conjured'
    };

    public static typesList = [
        { name : this.nameList.agedBrie,        value : AgedBrieChanger        },
        { name : this.nameList.backstagePasses, value : BackstagePassesChanger },
        { name : this.nameList.sulfuras,        value : SulfurasChanger        },
        { name : this.nameList.conjured,        value : ConjuredItemChanger    }
    ];

    public static getChanger(item: Item) {
        // Usamos filter para simplificar la búsqueda del tipo de changer deseado
        const changerType = this.typesList.filter(changer => changer.name === item.name);
        
        if (changerType.length > 0) {
            // Retornamos la instancia de la clase correspondiente
            return new changerType[0].value(item); 
        }
        
        // Si no se encuentra un tipo, retornamos el changer normal
        return new NormalItemChanger(item); 
    }
}


// Clase principal GildedRose
//-----------------------------------------------------------------------------
export class GildedRose {
    items: Array<Item>;

    constructor(items = [] as Array<Item>) {
        this.items = items;
    }

    updateQuality() {
        for (let item of this.items) {
            const changer = ItemChangerFactory.getChanger(item);
            changer.update();
        }

        return this.items;
    }
}


// Ejemplo de uso
//-----------------------------------------------------------------------------
const items = [
    new Item('+5 Dexterity Vest',                         10, 20),
    new Item('Aged Brie',                                 2,   0),
    new Item('Elixir of the Mongoose',                    5,   7),
    new Item('Sulfuras, Hand of Ragnaros',                0,  80),
    new Item('Sulfuras, Hand of Ragnaros',                -1, 80),
    new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
    new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49),
    new Item('Backstage passes to a TAFKAL80ETC concert', 5,  49),
    new Item('Conjured', 3, 6),
];

const gildedRose = new GildedRose(items);

console.log('Día 0:');
console.table(gildedRose.items);

for (let day = 1; day <= 5; day++) {
    const results = gildedRose.updateQuality();
    console.log(`Día ${day}:`);
    console.table(results);
}
