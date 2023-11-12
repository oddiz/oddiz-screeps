import { runEveryXTicks } from "utils/helpers";
import { roleBuilder } from "./roles/builder";
import { roleHarvester } from "./roles/harvester";

export class CreepManager {
    room: Room;
    static instances: any;

    constructor(room: Room) {
        this.room = room;
        // if a CreepManager with same room exists, return it
        // else create a new one
         if (CreepManager.instances[room.name]) {
             return CreepManager.instances[room.name];
         } else {
             CreepManager.instances[room.name] = this;
         }


    }

    run(): number {
        try {
            runEveryXTicks(1, this.workCreeps);
            runEveryXTicks(100, this.popControl);
            return 0;

        } catch (error) {
            console.log(`CreepManager.run() error, room: ${this.room.name} ` + error);
            return -1;
        }
    }

    popControl(): number {
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester");
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role == "builder");

        if (harvesters.length < 2) {
            const newName = "Harvester_" + this.room.name + "_" + getRandomFourDigitHex();
            console.log("Spawning new harvester: " + newName);
            Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role: "harvester" },
            });
        } else if (builders.length < 2) {
            const newName = "Builder_" + this.room.name + "_" + getRandomFourDigitHex();
            console.log("Spawning new builder: " + newName);
            Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role: "builder" },
            });
        }
        return 0;
    }

    workCreeps(): number {
        for (const creepName in this.room.find(FIND_MY_CREEPS)) {
            const creep = Game.creeps[creepName];
            switch (creep.memory.role) {
                case "harvester": {
                    roleHarvester.run(creep);
                    break;
                }
                case "builder": {
                    roleBuilder.run(creep);
                    break;
                }
                default: {
                    console.log("Creep role not implemented");
                    return 3;
                }
            }
        }
        return 0;
    }
}

/**
 * Return codes:
 * -1: Error
 * 0: Success
 * 1: Failure: No creeps
 * 2: Failure: No energy
 * 3: Not implemented
 *
 */


const getRandomFourDigitHex = () => {
    return Math.floor(Math.random() * 0xffff).toString(16);
}

