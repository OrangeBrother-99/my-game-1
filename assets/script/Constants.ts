export class Constants{

    static readonly Event ={
        GAME_OVER: 1,
        LEARN_SKILL: 2,
        LEARN_ACTIVE_SKILL: 3,
        // GAME_OVER: 1,
    }
    static readonly ColliderGroup={
        DEFAULT:1<<0,
        PLAYER:1<<1,
        MONSTER:1<<2,
        PLAYER_WEAPON:1<<3,
        MONSTER_WEAPON:1<<4,  
        OBSTACLE:1<<5,
    }
    static readonly  ResourceName={
         MONSTER: 'Monster',
         DAMAGETEXT: 'DamageText',
         DAGGER: 'Dagger',
         SURROUND: 'Surround',
         FIRE_BALL: 'FireBall',
         FIRE_EXPLODE: 'FireExplode',
         FLASH: 'Flash',
         BULLET: 'Bullet',
         SKILL_CARD: 'SkillCard',
         E_BULLET: 'EBullet',
         SWORD: 'Sword',
    }

    static readonly WeaponTag={
         DAGGER: 0,
         SWORD:1,
         FIRE_BALL: 2,
         FIRE_EXPLODE: 3,
         FLASH: 4,
         BULLET: 5,

         //怪物武器
         E_BULLET:100,
    }
}