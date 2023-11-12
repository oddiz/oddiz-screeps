export const roleBuilder = {
    /** @param {Creep} creep **/
    run(creep: Creep): number {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say("🔄 harvest");
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say("🚧 build");
        }

        if (creep.memory.working) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
                }
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
            }
        }
        return 0;
    }
};

Game.spawns["Spawn1"].room.createConstructionSite(23, 22, STRUCTURE_TOWER);
