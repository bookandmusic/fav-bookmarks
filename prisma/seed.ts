// prisma/seed.ts
import prisma from '@/lib/prisma'
import { Prisma, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

// 密码加密函数
async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export async function main() {
    try {
        // 开启事务
        await prisma.$transaction(async (tx) => {
            // 清理现有数据（按依赖顺序）
            await tx.category.deleteMany({})
            await tx.userOAuth.deleteMany({})
            await tx.user.deleteMany({})

            // 创建管理员用户
            const hashedPassword = await hashPassword('123456')
            const userData: Prisma.UserCreateInput = {
                username: 'admin',
                email: 'admin@test.com',
                password: hashedPassword,
                role: Role.ADMIN,
                categories: {
                    create: [
                        {
                            name: '开发工具',
                            pid: null,
                            icon: 'mdi:language-typescript'
                        },
                        {
                            name: '项目管理',
                            pid: null,
                            icon: 'mdi:chart-gantt'
                        },
                        {
                            name: '个人成长',
                            pid: null,
                            icon: 'streamline-plump:graph-bar-increase'
                        }
                    ]
                }
            }

            // 创建用户和关联分类
            const user = await tx.user.create({
                data: userData,
                include: {
                    categories: true
                }
            })

            console.log(`✅ Created user with ID: ${user.id}`)
            console.log(`📦 Created ${user.categories.length} categories:`)
            user.categories.forEach(cat => {
                console.log(` - ${cat.name} (${cat.id})`)
            })
        })
    } catch (error) {
        console.error('❌ Seed failed:', error)
        throw error
    }
}

// 执行种子脚本
main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })