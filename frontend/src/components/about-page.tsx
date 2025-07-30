"use client";

import React from "react";
import Image from "next/image";
import { Mail, Globe, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AboutPageProps {
  onBack: () => void;
}

const SKILLS_CATEGORIES = [
  {
    title: "Frontend",
    skills: ["React & Next.js", "TypeScript", "Tailwind CSS", "UI/UX Design"]
  },
  {
    title: "Backend", 
    skills: ["Node.js & Express", "REST APIs", "PostgreSQL"]
  },
  {
    title: "Tools & DevOps",
    skills: ["Docker", "CI/CD", "ArgoCD / Sentry / Grafana"]
  }
];

const CONTACT_INFO = [
  { icon: Mail, text: "Aldulaylan.A@gmail.com" },
  { icon: Globe, text: "LinkedIn" },
];

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="overflow-hidden">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-32 h-32 rounded-full overflow-hidden mb-4 ring-2 ring-primary/20">
                <Image
                  src="/profile-image.jpeg"
                  alt="Profile Image"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-4xl font-light">
                عزام الدليلان
              </CardTitle>
              <p className="text-lg text-muted-foreground">مهندس برمجيات أول</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-lg max-w-none text-right">
                <p className="text-base leading-relaxed text-foreground">
                  اهلا, أنا عزام الدليلان. مهندس برمجيات أول شغوف بالتقنية
                  والابتكار. أحب بناء تطبيقات ومواقع ويب تركّز على تجربة
                  المستخدم.
                </p>
                <p className="text-base leading-relaxed text-foreground">
                  متخصص في تطوير الويب الكامل (Full-Stack Development) باستخدام
                  تقنيات مثل React، Next.js، Node.js، والتعامل مع قواعد البيانات
                  المختلفة.
                </p>
                <p className="text-base leading-relaxed text-foreground">
                  هذا المشروع (تكليف) هو منصة مبسطة للبحث عن بودكاست، تهدف إلى
                  مساعدة المستخدمين في اكتشاف المحتوى الصوتي المناسب لاهتماماتهم
                  بسهولة وسرعة.
                </p>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-xl font-semibold mb-4">
                  التخصصات والمهارات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SKILLS_CATEGORIES.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-3">
                      <h4 className="text-lg font-medium text-primary mb-3">
                        {category.title}
                      </h4>
                      <div className="space-y-2">
                        {category.skills.map((skill, skillIndex) => (
                          <div
                            key={skillIndex}
                            className="bg-muted/50 rounded-lg p-3 text-center"
                          >
                            <span className="text-sm font-medium">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-xl font-semibold mb-4">التواصل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CONTACT_INFO.map(({ icon: Icon, text }, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-light">
                حول مشروع تكليف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-right">
                <p className="text-base leading-relaxed text-foreground">
                  تكليف هو مشروع شخصي يهدف إلى إنشاء منصة بحث متقدمة للبودكاست
                  باللغة العربية. يستخدم المشروع تقنيات حديثة مثل Next.js 14 في
                  الواجهة الأمامية و NestJS في الخلفية، مع التكامل مع iTunes API
                  لجلب بيانات البودكاست.
                </p>
                <p className="text-base leading-relaxed text-foreground">
                  الهدف من المشروع هو توفير تجربة بحث سلسة ومرئية جذابة
                  للمستخدمين العرب الباحثين عن محتوى البودكاست المناسب
                  لاهتماماتهم.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
