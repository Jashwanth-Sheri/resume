import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResumeData, PersonalInfo, Experience, Education, Skill } from '@shared/resume-types';
import { Save, Download, Eye, User, Briefcase, GraduationCap, Code, Edit3, EyeIcon } from 'lucide-react';

const initialPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  summary: ''
};

const initialResumeData: ResumeData = {
  personalInfo: initialPersonalInfo,
  experience: [],
  education: [],
  skills: []
};

export default function Index() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: '',
      honors: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: '',
      level: 'Intermediate'
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const saveResume = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      });
      
      if (response.ok) {
        const result = await response.json();
        setResumeData(result.data);
        console.log('Resume saved successfully');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportToPDF = () => {
    window.print();
  };

  const sectionButtons = [
    { key: 'personal' as const, label: 'Personal Info', icon: User },
    { key: 'experience' as const, label: 'Experience', icon: Briefcase },
    { key: 'education' as const, label: 'Education', icon: GraduationCap },
    { key: 'skills' as const, label: 'Skills', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Resume Builder</h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Create your perfect resume in minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button
                onClick={saveResume}
                disabled={isSaving}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
              <Button
                onClick={exportToPDF}
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            <Card className="border-orange-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Build Your Resume</CardTitle>
                <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 mt-4">
                  {sectionButtons.map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      variant={activeSection === key ? "default" : "outline"}
                      size="sm"
                      className={activeSection === key ?
                        "bg-primary text-white shadow-md" :
                        "border-orange-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300"
                      }
                    >
                      <Icon className="w-4 h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sm:hidden">{label.split(' ')[0]}</span>
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto">
                {/* Personal Information Section */}
                {activeSection === 'personal' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-orange-200 pb-2">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => updatePersonalInfo('location', e.target.value)}
                          placeholder="New York, NY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={resumeData.personalInfo.website}
                          onChange={(e) => updatePersonalInfo('website', e.target.value)}
                          placeholder="johndoe.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        placeholder="Brief description of your professional background and career objectives..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {/* Experience Section */}
                {activeSection === 'experience' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
                      <Button onClick={addExperience} size="sm" className="bg-primary">
                        Add Experience
                      </Button>
                    </div>
                    {resumeData.experience.map((exp, index) => (
                      <Card key={exp.id} className="border-orange-100">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label>Job Title *</Label>
                              <Input
                                value={exp.jobTitle}
                                onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                                placeholder="Software Engineer"
                              />
                            </div>
                            <div>
                              <Label>Company *</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                placeholder="Tech Corp"
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                placeholder="San Francisco, CA"
                              />
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <Label>End Date</Label>
                            <div className="flex items-center space-x-4">
                              <Input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                disabled={exp.isCurrentJob}
                              />
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={exp.isCurrentJob}
                                  onChange={(e) => updateExperience(exp.id, 'isCurrentJob', e.target.checked)}
                                  className="rounded border-orange-300"
                                />
                                <span className="text-sm">Current Job</span>
                              </label>
                            </div>
                          </div>
                          <div className="mb-4">
                            <Label>Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              placeholder="Describe your responsibilities and achievements..."
                              rows={3}
                            />
                          </div>
                          <Button
                            onClick={() => removeExperience(exp.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {resumeData.experience.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No work experience added yet. Click "Add Experience" to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Education Section */}
                {activeSection === 'education' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                      <Button onClick={addEducation} size="sm" className="bg-primary">
                        Add Education
                      </Button>
                    </div>
                    {resumeData.education.map((edu, index) => (
                      <Card key={edu.id} className="border-orange-100">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label>Degree *</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                placeholder="Bachelor of Science in Computer Science"
                              />
                            </div>
                            <div>
                              <Label>Institution *</Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                placeholder="University of California"
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={edu.location}
                                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                placeholder="Berkeley, CA"
                              />
                            </div>
                            <div>
                              <Label>Graduation Date</Label>
                              <Input
                                type="date"
                                value={edu.graduationDate}
                                onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>GPA (optional)</Label>
                              <Input
                                value={edu.gpa || ''}
                                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                placeholder="3.8"
                              />
                            </div>
                            <div>
                              <Label>Honors (optional)</Label>
                              <Input
                                value={edu.honors || ''}
                                onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                                placeholder="Cum Laude, Dean's List"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => removeEducation(edu.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {resumeData.education.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No education added yet. Click "Add Education" to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Skills Section */}
                {activeSection === 'skills' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                      <Button onClick={addSkill} size="sm" className="bg-primary">
                        Add Skill
                      </Button>
                    </div>
                    {resumeData.skills.map((skill, index) => (
                      <Card key={skill.id} className="border-orange-100">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label>Skill Name *</Label>
                              <Input
                                value={skill.name}
                                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                placeholder="JavaScript"
                              />
                            </div>
                            <div>
                              <Label>Category</Label>
                              <Input
                                value={skill.category}
                                onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                                placeholder="Programming Languages"
                              />
                            </div>
                            <div>
                              <Label>Level</Label>
                              <select
                                value={skill.level}
                                onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeSkill(skill.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {resumeData.skills.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Code className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No skills added yet. Click "Add Skill" to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="xl:sticky xl:top-6 xl:h-fit">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-base md:text-lg">
                  <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-white p-4 md:p-8 max-h-[calc(100vh-200px)] overflow-y-auto print:max-h-none print:overflow-visible">
                  {/* Resume Preview Content */}
                  <div className="max-w-none text-sm leading-relaxed">
                    {/* Header */}
                    <div className="text-center mb-6 pb-4 border-b-2 border-orange-500">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {resumeData.personalInfo.fullName || 'Your Name'}
                      </h1>
                      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-sm md:text-base text-gray-600">
                        {resumeData.personalInfo.email && (
                          <span className="break-all">{resumeData.personalInfo.email}</span>
                        )}
                        {resumeData.personalInfo.phone && (
                          <span>{resumeData.personalInfo.phone}</span>
                        )}
                        {resumeData.personalInfo.location && (
                          <span>{resumeData.personalInfo.location}</span>
                        )}
                      </div>
                      {(resumeData.personalInfo.linkedin || resumeData.personalInfo.website) && (
                        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mt-2 text-sm md:text-base text-orange-600">
                          {resumeData.personalInfo.linkedin && (
                            <span className="break-all">{resumeData.personalInfo.linkedin}</span>
                          )}
                          {resumeData.personalInfo.website && (
                            <span className="break-all">{resumeData.personalInfo.website}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    {resumeData.personalInfo.summary && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1">
                          Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                          {resumeData.personalInfo.summary}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1">
                          Work Experience
                        </h2>
                        <div className="space-y-4">
                          {resumeData.experience.map((exp) => (
                            <div key={exp.id}>
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                                  <p className="text-orange-600 font-medium">{exp.company}</p>
                                  {exp.location && <p className="text-gray-600">{exp.location}</p>}
                                </div>
                                <div className="text-right text-gray-600">
                                  <p>{exp.startDate} - {exp.isCurrentJob ? 'Present' : exp.endDate}</p>
                                </div>
                              </div>
                              {exp.description && (
                                <p className="text-gray-700 mt-2 leading-relaxed">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1">
                          Education
                        </h2>
                        <div className="space-y-3">
                          {resumeData.education.map((edu) => (
                            <div key={edu.id}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                  <p className="text-orange-600 font-medium">{edu.institution}</p>
                                  {edu.location && <p className="text-gray-600">{edu.location}</p>}
                                  {(edu.gpa || edu.honors) && (
                                    <div className="text-gray-600 text-sm mt-1">
                                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                      {edu.gpa && edu.honors && <span> | </span>}
                                      {edu.honors && <span>{edu.honors}</span>}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right text-gray-600">
                                  <p>{edu.graduationDate}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1">
                          Skills
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resumeData.skills.reduce((acc: any[], skill) => {
                            const existingCategory = acc.find(cat => cat.category === skill.category);
                            if (existingCategory) {
                              existingCategory.skills.push(skill);
                            } else {
                              acc.push({ category: skill.category || 'General', skills: [skill] });
                            }
                            return acc;
                          }, []).map((categoryGroup, index) => (
                            <div key={index}>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {categoryGroup.category}
                              </h3>
                              <div className="space-y-1">
                                {categoryGroup.skills.map((skill: Skill) => (
                                  <div key={skill.id} className="flex justify-between items-center">
                                    <span className="text-gray-700">{skill.name}</span>
                                    <span className="text-orange-600 text-sm font-medium">
                                      {skill.level}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {!resumeData.personalInfo.fullName && 
                     resumeData.experience.length === 0 && 
                     resumeData.education.length === 0 && 
                     resumeData.skills.length === 0 && (
                      <div className="text-center py-12 text-gray-400">
                        <Eye className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Your resume preview will appear here</h3>
                        <p>Start filling out the form on the left to see your resume come to life!</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
