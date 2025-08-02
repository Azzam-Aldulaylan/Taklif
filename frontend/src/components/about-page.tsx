"use client";

import React from "react";
import Image from "next/image";
import { Mail, Globe, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AboutPageProps {
  onBack: () => void;
}

const skillsCategories = [
  {
    title: "Frontend",
    skills: [
      "React & Next.js",
      "React Native",
      "TypeScript",
      "Tailwind CSS",
      "UI/UX Design",
    ],
  },
  {
    title: "Backend",
    skills: ["Django", "PHP Laravel", "NestJS", "REST APIs", "MySQL/PostgreSQL"],
  },
  {
    title: "Tools & DevOps",
    skills: ["Docker", "CI/CD", "ArgoCD", "Sentry", "Grafana"],
  },
];

const contactInfo = [
  {
    icon: Mail,
    text: "Aldulaylan.A@gmail.com",
    link: "mailto:Aldulaylan.A@gmail.com",
  },
  {
    icon: Globe,
    text: "LinkedIn",
    link: "https://sa.linkedin.com/in/a-aldulaylan",
  },
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
              <CardTitle className="text-4xl text-primary">
                عزام الدليلان
              </CardTitle>
              <p className="text-lg text-muted-foreground">مهندس برمجيات أول</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-right space-y-6">
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
                  <p className="text-lg leading-relaxed text-foreground font-light">
                    اهلا, أنا{" "}
                    <span className="font-semibold text-primary">
                      عزام الدليلان
                    </span>
                    . مهندس برمجيات أول شغوف بالتقنية والابتكار. أحب بناء
                    تطبيقات ومواقع ويب تركّز على تجربة المستخدم المميزة.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/30 rounded-lg p-5 border border-muted/50">
                    <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                      التخصص
                    </h4>
                    <p className="text-base leading-relaxed text-foreground">
                      متخصص في تطوير الويب الكامل (Full-Stack Development)
                      باستخدام تقنيات حديثة مثل React، Next.js، Django، والتعامل
                      مع قواعد البيانات المختلفة.
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-5 border border-muted/50">
                    <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                      المشروع
                    </h4>
                    <p className="text-base leading-relaxed text-foreground">
                      هذا المشروع (تكليف) هو منصة مبسطة للبحث عن بودكاست، تهدف
                      إلى مساعدة المستخدمين في اكتشاف المحتوى الصوتي المناسب
                      لاهتماماتهم بسهولة وسرعة.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-xl font-semibold mb-4">
                  التخصصات والمهارات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {skillsCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-3">
                      <h4 className="text-lg font-medium text-primary text-center mb-3">
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
                  {contactInfo.map(({ icon: Icon, text, link }, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-s mr-2">{text}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
