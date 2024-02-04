import { Skill, SkillFireball, SkillCycloneKnife, SkillFlash } from "./Skill";

export function createPlayer1Skill(): Skill[] {
    let skills: Skill[] = [];
    skills.push(new SkillFireball());
    skills.push(new SkillCycloneKnife());
    skills.push(new SkillFlash());
    return skills;
}