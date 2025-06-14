"use client";
import { Icon } from "@iconify/react";
import { User } from "@prisma/client";
import { Avatar, Button, Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import Link from "next/link";
import { signOut } from "next-auth/react";

const avatars = [
  "arcticons:20-minutes-till-dawn",
  "arcticons:52-weeks-money-challenge",
  "arcticons:870-games",
  "arcticons:abema-tv",
  "arcticons:abrp",
  "arcticons:adaptive-toons-icon",
  "arcticons:aether-gazer",
];
const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
const goods = [
  "我是一名洗晚工，每当接近天亮时，我就会把夜晚洗去。",
  "便宜的键盘认为自己是被敲打的命运，贵的键盘认为自己是被抚摸的",
  "小孩没有钱就只能回家，大人没有钱就无法回家。",
  "你们都说我是蒻智，其实只有我遵守了当年一起不长大的约定",
  "梦是眼皮里的壁画",
  "死亡是人生的通关奖励",
  "爱情让人盲目，也让盲人重获光明。",
  "每天世界都在朝我发射一支名叫光阴的箭。终于有一天，我发现我不是小孩子了",
];

const randomGood = goods[Math.floor(Math.random() * goods.length)];
export function UserProfileCard({ user }: { user: User }) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // 默认会重定向到首页
  };
  return (
    <>
      <Card
        actions={[
          <Button key={"gitee"} type="text">
            <Link href={"/admin"}>
              <Icon icon={"ic:baseline-admin-panel-settings"} width={18}></Icon>
            </Link>
          </Button>,
          <Button key={"github"} type="text" onClick={handleLogout}>
            <Icon icon={"ic:baseline-logout"} width={18}></Icon>
          </Button>,
        ]}
        className="max-w-[300px]"
      >
        <Meta
          avatar={
            user.avatar ? (
              <Avatar src={user.avatar} />
            ) : (
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<Icon icon={randomAvatar} />}
              />
            )
          }
          title={user.username}
          description={randomGood}
        />

        <div className="flex flex-col py-2">
          <Row>
            <Col span={6}>邮箱</Col>
            <Col span={18}>{user.email ? user.email : "未设置"}</Col>
          </Row>
          <Row>
            <Col span={6}>手机</Col>
            <Col span={18}>{user.phone ? user.phone : "未设置"}</Col>
          </Row>
          <Row>
            <Col span={6}>身份</Col>
            <Col span={18}>{user.role === "ADMIN" ? "管理员" : "普通用户"}</Col>
          </Row>
        </div>
      </Card>
    </>
  );
}
