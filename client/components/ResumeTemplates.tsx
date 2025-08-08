import React from 'react';
import { ResumeData, ResumeSection } from '@shared/resume-types';
import { User } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
  sectionOrder: ResumeSection[];
  onSectionReorder: (sections: ResumeSection[]) => void;
}

interface SortableSectionProps {
  section: ResumeSection;
  children: React.ReactNode;
}

function SortableSection({ section, children }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${
        isDragging ? 'z-50' : ''
      } hover:bg-orange-25 transition-colors duration-200 rounded-md p-2 -m-2`}
    >
      {children}
    </div>
  );
}

export function ResumePreview({ resumeData, template, sectionOrder, onSectionReorder }: ResumePreviewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.findIndex((section) => section.id === active.id);
      const newIndex = sectionOrder.findIndex((section) => section.id === over?.id);

      onSectionReorder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const renderPersonalSection = () => (
    <div className="text-center mb-6 pb-4 border-b-2 border-orange-500">
      {resumeData.personalInfo.profilePicture && (
        <div className="flex justify-center mb-4">
          <img
            src={resumeData.personalInfo.profilePicture}
            alt="Profile"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-orange-500 shadow-lg"
          />
        </div>
      )}
      <h1 className={`font-bold text-gray-900 mb-2 ${getHeaderSize(template)}`}>
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
  );

  const renderSummarySection = () => {
    if (!resumeData.personalInfo.summary) return null;
    return (
      <div className="mb-6">
        <h2 className={`font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1 ${getSectionHeaderSize(template)}`}>
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {resumeData.personalInfo.summary}
        </p>
      </div>
    );
  };

  const renderExperienceSection = () => {
    if (resumeData.experience.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className={`font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1 ${getSectionHeaderSize(template)}`}>
          Work Experience
        </h2>
        <div className="space-y-4">
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className={getExperienceLayout(template)}>
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
    );
  };

  const renderEducationSection = () => {
    if (resumeData.education.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className={`font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1 ${getSectionHeaderSize(template)}`}>
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
    );
  };

  const renderSkillsSection = () => {
    if (resumeData.skills.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className={`font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1 ${getSectionHeaderSize(template)}`}>
          Skills
        </h2>
        <div className={getSkillsLayout(template)}>
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
                {categoryGroup.skills.map((skill: any) => (
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
    );
  };

  const renderSection = (section: ResumeSection) => {
    if (!section.visible) return null;

    switch (section.type) {
      case 'personal':
        return renderPersonalSection();
      case 'summary':
        return renderSummarySection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      default:
        return null;
    }
  };

  const visibleSections = sectionOrder.filter(section => section.visible);

  if (!resumeData.personalInfo.fullName && 
      resumeData.experience.length === 0 && 
      resumeData.education.length === 0 && 
      resumeData.skills.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <User className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Your resume preview will appear here</h3>
        <p>Start filling out the form on the left to see your resume come to life!</p>
        <p className="text-sm mt-2">You can drag and drop sections to reorder them.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-none text-sm leading-relaxed ${getTemplateStyles(template)}`}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={visibleSections.map(section => section.id)}
          strategy={verticalListSortingStrategy}
        >
          {visibleSections.map((section) => (
            <SortableSection key={section.id} section={section}>
              {renderSection(section)}
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Template-specific styling functions
function getTemplateStyles(template: string): string {
  switch (template) {
    case 'modern':
      return 'font-sans';
    case 'creative':
      return 'font-sans bg-gradient-to-br from-orange-50 to-white p-4 rounded-lg';
    case 'minimal':
      return 'font-mono text-gray-800';
    default:
      return 'font-serif';
  }
}

function getHeaderSize(template: string): string {
  switch (template) {
    case 'creative':
      return 'text-3xl md:text-4xl';
    case 'minimal':
      return 'text-xl md:text-2xl';
    default:
      return 'text-2xl md:text-3xl';
  }
}

function getSectionHeaderSize(template: string): string {
  switch (template) {
    case 'creative':
      return 'text-2xl';
    case 'minimal':
      return 'text-lg';
    default:
      return 'text-xl';
  }
}

function getExperienceLayout(template: string): string {
  switch (template) {
    case 'creative':
      return 'bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-400';
    case 'minimal':
      return 'border-l-2 border-gray-300 pl-4';
    default:
      return '';
  }
}

function getSkillsLayout(template: string): string {
  switch (template) {
    case 'creative':
      return 'grid grid-cols-1 gap-4';
    case 'minimal':
      return 'space-y-2';
    default:
      return 'grid grid-cols-1 md:grid-cols-2 gap-4';
  }
}
