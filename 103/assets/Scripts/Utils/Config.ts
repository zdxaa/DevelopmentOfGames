import { Vec3 } from "cc"

export class Config {
    public static ScreenWidth: number = 1280
    public static ScreenHeight: number = 720
    public static RoleWorldPos = new Vec3(0, 0, 0)

}
/**角色朝向*/
export enum RoleAni {
    default = 0,
    left = 3,
    right = 4,
    up = 2,
    down = 1
}