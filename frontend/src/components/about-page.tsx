"use client";

import React from "react";
import Image from "next/image";
import { Mail, Globe, ArrowRight, CircleDot } from "lucide-react";
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
    skills: [
      "Django",
      "PHP Laravel",
      "NestJS",
      "REST APIs",
      "MySQL/PostgreSQL",
    ],
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
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        {/* Back button */}
        <div className="mb-8 animate-fade-in">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile card */}
          <Card className="overflow-hidden animate-delay-1 bg-white/60">
            <div className="">
              <CardHeader className="text-center pb-6 ">
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
                <p className="text-lg text-muted-foreground">
                  مهندس برمجيات أول
                </p>
              </CardHeader>
              <CardContent className="space-y-8 ">
                <div className="text-right space-y-6">
                  {/* Bio section */}
                  <div className="about-card-primary rounded-xl p-8 animate-delay-2">
                    <p className="text-lg leading-relaxed text-foreground font-light">
                      اهلا, أنا{" "}
                      <span className="font-semibold text-primary">
                        عزام الدليلان
                      </span>
                      . مهندس برمجيات أول شغوف بالتقنية والابتكار. أحب بناء
                      تطبيقات ومواقع ويب تركّز على تجربة المستخدم المميزة.
                    </p>
                  </div>

                  {/* Specialty cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-delay-3">
                    <div className="about-card-primary rounded-lg p-5 shadow-sm">
                      <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                        التخصص
                      </h4>
                      <p className="text-base leading-relaxed text-foreground">
                        متخصص في تطوير الويب الكامل (Full-Stack Development)
                        باستخدام تقنيات حديثة مثل React، Next.js، Django،
                        والتعامل مع قواعد البيانات المختلفة.
                      </p>
                    </div>

                    <div className="about-card-primary rounded-lg p-5 shadow-sm">
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

                {/* Skills section */}
                <div className="pt-6 border-t animate-delay-4">
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
                              className="rounded-lg p-3 text-center"
                            >
                              <span className="text-sm font-medium ">
                                {skill}
                                <CircleDot className=" inline-block h-3 w-3 text-primary mr-2" />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact section */}
                <div className="pt-6 border-t animate-delay-4">
                  <h3 className="text-xl font-semibold mb-4">التواصل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactInfo.map(({ icon: Icon, text, link }, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center p-3 rounded-lg">
                          <Icon className="h-5 w-5 text-primary ml-3 flex-shrink-0" />
                          <span className="text-sm font-medium">{text}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
