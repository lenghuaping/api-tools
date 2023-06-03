import { IConfig, Ip, IUser } from "../interfaces/index";

const commentHeader = "/**\n";
const commentFooter: string = "*/\n";
const commentQueryTitle: string = " * Query参数\n";
const commentPathHeader: string = " * 路径参数\n";

const user: IUser = {
  email: "110110110@qq.com",
  password: "********",
};

const Ip: Ip = {
  host: "192.168.0.1",
  port: "3000",
}

const config: IConfig = {
  user: user,
  Ip: Ip,
  commentHeader: commentHeader,
  commentFooter: commentFooter,
  commentQueryTitle: commentQueryTitle,
  commentPathHeader: commentPathHeader,
};

export default config;
