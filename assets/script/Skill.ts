export enum SkillID {

    NONE = 0,
    FIREBALL = 4,
    FLASH = 3,
    Cyclone_Knife = 11,
    Lightning = 6,
    Invincible = 7,
    InsertHP = 12,
    ReduceCd = 13,
    InsertExp = 14
}

export abstract class Skill {       

    private _id: SkillID = SkillID.NONE;
    private _level: number = 0;
    private _maxlevel: number = 0;
    //技能组合id
    private _compentId: number = 0;

    private _isMaxLevel: boolean = false;

    private _cd: number = 0;

    private _isIndicator: boolean = false;


    protected constructor(id: SkillID, compentId: number, cd: number, isIndicator: boolean = false, level: number = 0, maxlevel: number = 4) {

        this._id = id;
        this._level = level;
        this._maxlevel = maxlevel;
        this._compentId = compentId;
        this._cd = cd;
        this._isIndicator = isIndicator;

    }

    public get cd(): number {
        return this._cd;
    }
    public set cd(value: number) {
        this._cd = value;
    }

    public get isIndicator(): boolean {
        return this._isIndicator;
    }
    public set isIndicator(value: boolean) {
        this._isIndicator = value;
    }
    get id(): SkillID {
        return this._id;
    }

    get level(): number {
        return this._level;
    }

    get maxlevel(): number {
        return this._maxlevel;
    }

    get compentId(): number {
        return this._compentId;
    }

    get isMaxLevel(): boolean {
        return this.level == this._maxlevel;
    }



    abstract getName(): string;
    abstract getdesc(): string;

    public levelUp(): void {
        !this._isMaxLevel && this._level++;
    }


}

export class SkillFireball extends Skill {



    constructor(level: number = 0, maxlevel: number = 4) {
        super(SkillID.FIREBALL, 0, 1, true, level, maxlevel);
    }

    getName(): string {
        return "火球术";
    }
    getdesc(): string {
        return "[主动]释放火球命中敌人后爆炸";
    }

}


export class SkillFlash extends Skill {

    constructor(level: number = 0, maxlevel: number = 4) {
        super(SkillID.FLASH, 0, 4, false, level, maxlevel);
    }



    getName(): string {
        return "闪现";
    }
    getdesc(): string {
        return "[主动]向移动方向进行短距离快速移动";
    }
}

export class SkillLightning extends Skill {

    constructor(level: number = 0, maxlevel: number = 4) {
        super(SkillID.Lightning, 0, 4, false, level, maxlevel);
    }


    getName(): string {
        return "闪电术";
    }
    getdesc(): string {
        return "[主动]召唤闪电，进行攻击";
    }
}


export class SkillInvincible extends Skill {

    constructor(level: number = 0, maxlevel: number = 4) {
        super(SkillID.Invincible, 0, 4, false, level, maxlevel);
    }

    getName(): string {
        return "无敌";
    }
    getdesc(): string {
        return "[主动]进入无敌状态，免疫一切伤害";
    }
}

export class SkillCycloneKnife extends Skill {

    constructor(level: number = 0, maxlevel: number = 4) {
        super(SkillID.Cyclone_Knife, 0, 4, false, level, maxlevel);
    }

    getName(): string {
        return "旋风刀";
    }
    getdesc(): string {
        return "[主动]召唤旋风刀围绕自身旋转攻击敌人";
    }
}



export class SkillInsertHP extends Skill {

    constructor(level: number = 0, maxlevel: number = 4) {
        super(SkillID.InsertHP, 0, 4, false, level, maxlevel);
    }

    getName(): string {
        return "增加生命值";
    }
    getdesc(): string {
        return "[被动]立刻回复生命值100点";
    }
}

export class SkillInsertExp extends Skill {
    constructor(level: number = 0, maxlevel: number = 4) {
        super(SkillID.InsertExp, 0, 4, false, level, maxlevel);
    }

    getName(): string {
        return "增加经验值";
    }
    getdesc(): string {
        return "[被动]获取100点*Level的经验值";
    }
}

export class SkillReduceCd extends Skill {
    constructor(level: number = 0, maxlevel: number = 4) {
        super(SkillID.ReduceCd, 0, 4, false, level, maxlevel);
    }

    getName(): string {
        return "减少技能cd";
    }
    getdesc(): string {
        return "[被动]减少1秒全技能cd,本局内生效。";
    }
}


