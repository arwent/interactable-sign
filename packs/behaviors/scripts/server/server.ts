/// <reference types="minecraft-scripting-types-server" />

namespace Server {
    const debug = false

    const system = server.registerSystem(0, 0);
    const interactableItems: InteractableItem[] = []

    //<editor-fold desc="Log function">
    function log(...items: any[]) {
        if (debug) {
            const chatEventData = system.createEventData('minecraft:display_chat_event')

            const toString = (item: any) => {
                switch (Object.prototype.toString.call(item)) {
                    case '[object Undefined]':
                        return 'undefined';
                    case '[object Null]':
                        return 'null';
                    case '[object String]':
                        return `"${item}"`;
                    case '[object Array]':
                        const array = item.map(toString);
                        return `[${array.join(', ')}]`;
                    case '[object Object]':
                        const object: any = Object.keys(item).map(key => `${key}: ${toString(item[key])}`);
                        return `{${object.join(', ')}}`;
                    case '[object Function]':
                        return item.toString();
                    default:
                        return item;
                }
            }

            chatEventData.data.message = items.map(toString).join(' ')
            system.broadcastEvent('minecraft:display_chat_event', chatEventData)
        }
    }

    //</editor-fold>

    //<editor-fold desc="Interactable Item Class">
    enum Interactable {
        SIGN,
        ITEM_FRAME,
        BLOCK
    }

    declare interface IInteractableItem {
        type: Interactable
        name: string
        position: VectorXYZ
        price: number
        func: (player: IEntity) => void
    }

    class InteractableItem {
        protected Interface: IInteractableItem

        constructor(body: IInteractableItem) {
            this.Interface = body
            interactableItems.push(this)
        }

        getPosition() {
            return this.Interface.position
        }

        isInteracted(_position: VectorXYZ) {
            return _position.x === this.Interface.position.x && _position.y === this.Interface.position.y && _position.z === this.Interface.position.z;
        }

        func(player: IEntity) {
            return this.Interface.func(player)
        }
    }

    //</editor-fold>

    //<editor-fold desc="Minecraft System">
    system.initialize = function () {
        initializeInteractableItems()
        this.listenForEvent("minecraft:block_interacted_with", (eventData: IEventData<IBlockInteractedWithEventData>) => onBlockInteracted(eventData))
    }

    system.update = function () {
    }

    function initializeInteractableItems() {
        new InteractableItem({
            type: Interactable.SIGN,
            name: "setTimeDay",
            position: {x: 3, y: 5, z: 8},
            price: 0,
            func: (player: IEntity) => {
                system.executeCommand("/time set day", (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.SIGN,
            name: "setTimeNight",
            position: {x: 2, y: 5, z: 8},
            price: 0,
            func: (player: IEntity) => {
                system.executeCommand("/time set night", (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.SIGN,
            name: "setWeatherClear",
            position: {x: -2, y: 5, z: 8},
            price: 0,
            func: (player: IEntity) => {
                system.executeCommand("/weather clear", (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.SIGN,
            name: "setWeatherThunder",
            position: {x: -3, y: 5, z: 8},
            price: 0,
            func: (player: IEntity) => {
                system.executeCommand("/weather thunder", (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.SIGN,
            name: "spawnChicken",
            position: {x: -3, y: 5, z: 4},
            price: 0,
            func: (player: IEntity) => {
                let chicken = system.createEntity("entity", "minecraft:chicken")
                let chickenPosition = system.getComponent(chicken, "minecraft:position")

                //@ts-ignore
                chickenPosition.data.x = -10
                //@ts-ignore
                chickenPosition.data.y = 4
                //@ts-ignore
                chickenPosition.data.z = 6

                system.applyComponentChanges(chicken, chickenPosition)
            }
        })

        new InteractableItem({
            type: Interactable.SIGN,
            name: "spawnZombie",
            position: {x: -2, y: 5, z: 4},
            price: 0,
            func: (player: IEntity) => {
                let zombie = system.createEntity("entity", "minecraft:zombie")
                let zombiePosition = system.getComponent(zombie, "minecraft:position")

                //@ts-ignore
                zombiePosition.data.x = -10
                //@ts-ignore
                zombiePosition.data.y = 4
                //@ts-ignore
                zombiePosition.data.z = 6

                system.applyComponentChanges(zombie, zombiePosition)
            }
        })

        new InteractableItem({
            type: Interactable.SIGN,
            name: "giveGoldenApple",
            position: {x: 2, y: 5, z: 4},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] golden_apple 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.ITEM_FRAME,
            name: "giveGoldenApple",
            position: {x: 2, y: 4, z: 4},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] golden_apple 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.SIGN,
            name: "giveWoodenPickAxe",
            position: {x: 3, y: 5, z: 4},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] wooden_pickaxe 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.ITEM_FRAME,
            name: "giveWoodenPickAxe",
            position: {x: 3, y: 4, z: 4},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] wooden_pickaxe 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.BLOCK,
            name: "ironOre",
            position: {x: 5, y: 5, z: 9},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] iron_ore 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.BLOCK,
            name: "ironOre",
            position: {x: 5, y: 5, z: 3},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] iron_ore 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.BLOCK,
            name: "ironOre",
            position: {x: -5, y: 5, z: 9},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] iron_ore 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.BLOCK,
            name: "ironOre",
            position: {x: -5, y: 5, z: 3},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] iron_ore 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.BLOCK,
            name: "diamondOre",
            position: {x: 0, y: 5, z: 9},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] diamond_ore 1`, (cb) => {
                    log(cb)
                })
            }
        })

        new InteractableItem({
            type: Interactable.BLOCK,
            name: "goldenOre",
            position: {x: 0, y: 5, z: 3},
            price: 0,
            func: (player: IEntity) => {
                //@ts-ignore
                let {x, y, z} = system.getComponent(player, "minecraft:position").data

                system.executeCommand(`/give @p[x=${x},y=${y},z=${z},r=1,c=1] gold_ore 1`, (cb) => {
                    log(cb)
                })
            }
        })
    }

    function onBlockInteracted(eventData: IEventData<IBlockInteractedWithEventData>) {
        log(eventData.data.block_position)

        interactableItems.map((interatacbleItem: InteractableItem, key: number) => {
            if (interatacbleItem.isInteracted(eventData.data.block_position)) {
                interatacbleItem.func(eventData.data.player)
            }
        })
    }
}

