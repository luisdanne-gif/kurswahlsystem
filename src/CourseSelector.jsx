import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

const CourseSelector = () => {
  // Define what courses can be paired with each course in positions 1-2
  const pairingsPhase1 = {
    'english': ['deutsch', 'spanish', 'musik', 'kunst', 'politik', 'mathe', 'biologie', 'chemie', 'physik', 'informatik'],
    'spanish': ['deutsch', 'english', 'musik', 'kunst', 'mathe', 'biologie', 'chemie', 'physik', 'informatik'],
    'deutsch': ['english', 'spanish', 'chemie', 'physik', 'musik', 'kunst', 'politik'],
    'mathe': ['english', 'spanish', 'musik', 'kunst', 'politik', 'chemie', 'physik'],
    'informatik': ['english', 'spanish', 'chemie', 'physik'],
    'musik': ['english', 'spanish', 'mathe', 'biologie', 'deutsch'],
    'kunst': ['english', 'spanish', 'mathe', 'biologie', 'deutsch'],
    'politik': ['english', 'mathe', 'biologie', 'deutsch'],
    'biologie': ['english', 'spanish', 'musik', 'kunst', 'politik', 'chemie', 'physik'],
    'chemie': ['english', 'spanish', 'mathe', 'deutsch', 'biologie', 'informatik'],
    'physik': ['english', 'spanish', 'mathe', 'deutsch', 'biologie', 'informatik']
  };

  const courseData = {
    'english': { name: 'English', level: 1, phase: 1 },
    'spanish': { name: 'Spanish', level: 1, phase: 1 },
    'deutsch': { name: 'Deutsch', level: 1, phase: 1 },
    'musik': { name: 'Musik', level: 1, phase: 1 },
    'kunst': { name: 'Kunst', level: 1, phase: 1 },
    'mathe': { name: 'Mathe', level: 1, phase: 1 },
    'politik': { name: 'Politik', level: 1, phase: 1 },
    'biologie': { name: 'Biologie', level: 1, phase: 1 },
    'chemie': { name: 'Chemie', level: 2, phase: 1 },
    'physik': { name: 'Physik', level: 2, phase: 1 },
    'informatik': { name: 'Informatik', level: 2, phase: 1 },
    // Phase 2 exclusive courses
    'philosophie': { name: 'Philosophie', level: 1, phase: 2 },
    'geschichte': { name: 'Geschichte', level: 1, phase: 2 },
    'erdkunde': { name: 'Erdkunde', level: 1, phase: 2 },
    'fremdsprache': { name: 'FremdSprache', level: 1, phase: 2 },
    'darstellendesspiel': { name: 'DarstellendesSpiel', level: 1, phase: 2 },
    'sport': { name: 'Sport', level: 1, phase: 2 }
  };

  // Determine Phase 2 requirements based on Phase 1 selections
  const getPhase2Requirements = () => {
    const course1 = phase1Courses[0];
    const course2 = phase1Courses[1];
    
    if (!course1 || !course2) return null;
    
    // Sort to normalize combinations (order doesn't matter)
    const combo = [course1, course2].sort().join('-');
    
    // Helper to check if a course is in a list
    const isIn = (course, list) => list.includes(course);
    const hasAny = (courses, list) => courses.some(c => list.includes(c));
    
    const req1Courses = ['politik', 'philosophie', 'geschichte', 'erdkunde'];
    const req2Courses = ['mathe', 'biologie', 'chemie', 'physik', 'informatik'];
    const sciences = ['biologie', 'chemie', 'physik'];
    const arts = ['musik', 'kunst'];
    
    const both = [course1, course2];
    
    // English + Deutsch
    if (hasAny(both, ['english']) && hasAny(both, ['deutsch'])) {
      return {
        req1: true,
        req2: true,
        beliebigen: 1,
        mathSlots: [3, 4], // Math only in slots 3 or 4
        extraReq: null
      };
    }
    
    // Spanish + Deutsch
    if (hasAny(both, ['spanish']) && hasAny(both, ['deutsch'])) {
      return {
        req1: true,
        req2: true,
        beliebigen: 1,
        mathSlots: [3, 4],
        extraReq: null
      };
    }
    
    // English + Spanish
    if (hasAny(both, ['english']) && hasAny(both, ['spanish'])) {
      return {
        req1: true,
        req2: true,
        beliebigen: 0,
        mathSlots: [3, 4],
        extraReq: {
          type: 'conditional',
          condition: 'if_not_mathe_then_deutsch',
          courses: ['deutsch'],
          slots: [3, 4],
          message: 'If you don\'t choose Mathe for Req2, you must choose Deutsch in slot 3 or 4'
        }
      };
    }
    
    // English + Politik
    if (hasAny(both, ['english']) && hasAny(both, ['politik'])) {
      return {
        req1: true,
        req2: true,
        beliebigen: 0,
        mathSlots: [3, 4],
        extraReq: {
          type: 'conditional',
          condition: 'if_not_mathe_then_deutsch',
          courses: ['deutsch'],
          slots: [3, 4],
          message: 'If you don\'t choose Mathe for Req2, you must choose Deutsch in slot 3 or 4'
        }
      };
    }
    
    // English + Mathe
    if (hasAny(both, ['english']) && hasAny(both, ['mathe'])) {
      return {
        req1: true,
        req2: false,
        beliebigen: 2,
        mathSlots: [],
        extraReq: null
      };
    }
    
    // Spanish + Mathe
    if (hasAny(both, ['spanish']) && hasAny(both, ['mathe'])) {
      return {
        req1: true,
        req2: false,
        beliebigen: 2,
        mathSlots: [],
        extraReq: null
      };
    }
    
    // English + (Biologie or Chemie or Physik)
    if (hasAny(both, ['english']) && hasAny(both, sciences)) {
      return {
        req1: true,
        req2: false,
        beliebigen: 1,
        mathSlots: [3, 4],
        extraReq: {
          type: 'choose_one',
          courses: ['deutsch', 'mathe'],
          slots: [3, 4],
          message: 'Must choose Deutsch OR Mathe in slot 3 or 4'
        }
      };
    }
    
    // Spanish + (Biologie or Chemie or Physik or Informatik)
    if (hasAny(both, ['spanish']) && hasAny(both, [...sciences, 'informatik'])) {
      return {
        req1: true,
        req2: false,
        beliebigen: 1,
        mathSlots: [3, 4],
        extraReq: {
          type: 'choose_one',
          courses: ['deutsch', 'mathe'],
          slots: [3, 4],
          message: 'Must choose Deutsch OR Mathe in slot 3 or 4'
        }
      };
    }
    
    // Mathe + (Musik or Kunst)
    if (hasAny(both, ['mathe']) && hasAny(both, arts)) {
      return {
        req1: true,
        req2: false,
        beliebigen: 1,
        mathSlots: [],
        extraReq: {
          type: 'choose_one',
          courses: ['deutsch', 'fremdsprache'],
          slots: [3, 4],
          message: 'Must choose Deutsch OR FremdSprache in slot 3 or 4'
        }
      };
    }
    
    // Mathe + Politik
    if (hasAny(both, ['mathe']) && hasAny(both, ['politik'])) {
      return {
        req1: false,
        req2: false,
        beliebigen: 2,
        mathSlots: [],
        extraReq: {
          type: 'choose_one',
          courses: ['deutsch', 'fremdsprache'],
          slots: [3, 4],
          message: 'Must choose Deutsch OR FremdSprache in slot 3 or 4'
        }
      };
    }
    
    // Mathe + (Chemie or Physik)
    if (hasAny(both, ['mathe']) && hasAny(both, ['chemie', 'physik'])) {
      return {
        req1: true,
        req2: false,
        beliebigen: 1,
        mathSlots: [],
        extraReq: {
          type: 'choose_one',
          courses: ['deutsch', 'fremdsprache'],
          slots: [3, 4],
          message: 'Must choose Deutsch OR FremdSprache in slot 3 or 4'
        }
      };
    }
    
    // (Chemie or Physik) + Deutsch
    if (hasAny(both, ['chemie', 'physik']) && hasAny(both, ['deutsch'])) {
      return {
        req1: true,
        req2: false,
        beliebigen: 1,
        mathSlots: [],
        extraReq: {
          type: 'choose_one',
          courses: ['deutsch', 'fremdsprache'],
          slots: [3, 4],
          message: 'Must choose Deutsch OR FremdSprache in slot 3 or 4'
        }
      };
    }
    
    // Biologie + (Musik or Kunst)
    if (hasAny(both, ['biologie']) && hasAny(both, arts)) {
      return {
        req1: true,
        req2: false,
        beliebigen: 0,
        mathSlots: [3, 4],
        extraReq: {
          type: 'choose_two_of_three',
          courses: ['deutsch', 'mathe', 'fremdsprache'],
          slots: [3, 4],
          message: 'Must choose 2 of: Deutsch, Mathe, FremdSprache in slots 3 and 4'
        }
      };
    }
    
    // Biologie + Politik
    if (hasAny(both, ['biologie']) && hasAny(both, ['politik'])) {
      return {
        req1: false,
        req2: false,
        beliebigen: 1,
        mathSlots: [3, 4],
        extraReq: {
          type: 'choose_two_of_three',
          courses: ['deutsch', 'mathe', 'fremdsprache'],
          slots: [3, 4],
          message: 'Must choose 2 of: Deutsch, Mathe, FremdSprache in slots 3 and 4'
        }
      };
    }
    
    // Biologie + (Chemie or Physik)
    if (hasAny(both, ['biologie']) && hasAny(both, ['chemie', 'physik'])) {
      return {
        req1: true,
        req2: false,
        beliebigen: 0,
        mathSlots: [3, 4],
        extraReq: {
          type: 'choose_two_of_three',
          courses: ['deutsch', 'mathe', 'fremdsprache'],
          slots: [3, 4],
          message: 'Must choose 2 of: Deutsch, Mathe, FremdSprache in slots 3 and 4'
        }
      };
    }
    
    // (Chemie or Physik) + Informatik
    if (hasAny(both, ['chemie', 'physik']) && hasAny(both, ['informatik'])) {
      return {
        req1: true,
        req2: false,
        beliebigen: 0,
        mathSlots: [3, 4],
        extraReq: {
          type: 'choose_two_of_three',
          courses: ['deutsch', 'mathe', 'fremdsprache'],
          slots: [3, 4],
          message: 'Must choose 2 of: Deutsch, Mathe, FremdSprache in slots 3 and 4'
        }
      };
    }
    
    // Deutsch + (Musik or Kunst)
    if (hasAny(both, ['deutsch']) && hasAny(both, arts)) {
      return {
        req1: true,
        req2: true,
        beliebigen: 0,
        mathSlots: [3, 4],
        extraReq: {
          type: 'conditional',
          condition: 'if_not_mathe_then_fremdsprache',
          courses: ['fremdsprache'],
          slots: [3, 4],
          message: 'Must choose Mathe OR FremdSprache in slot 3 or 4. If Mathe chosen, Req2 is fulfilled'
        }
      };
    }
    
    // Deutsch + Politik
    if (hasAny(both, ['deutsch']) && hasAny(both, ['politik'])) {
      return {
        req1: true,
        req2: true,
        beliebigen: 0,
        mathSlots: [3, 4],
        extraReq: {
          type: 'conditional',
          condition: 'if_not_mathe_then_fremdsprache',
          courses: ['fremdsprache'],
          slots: [3, 4],
          message: 'Must choose Mathe OR FremdSprache in slot 3 or 4. If Mathe chosen, Req2 is fulfilled'
        }
      };
    }
    
    // Default fallback
    return {
      req1: true,
      req2: true,
      beliebigen: 1,
      mathSlots: [3, 4],
      extraReq: null
    };
  };

  const [phase1Courses, setPhase1Courses] = useState(['', '']); // First 2 courses
  const [phase2Courses, setPhase2Courses] = useState(['', '', '']); // Courses 3-5

  // Get available courses for Phase 1 (courses 1-2)
  const getAvailablePhase1Courses = (position) => {
    const otherPosition = position === 0 ? 1 : 0;
    const otherCourse = phase1Courses[otherPosition];

    // Filter to only Phase 1 courses
    const phase1OnlyCourses = Object.keys(courseData).filter(id => courseData[id].phase === 1);

    // If no course selected in other position, all Phase 1 courses available
    if (!otherCourse) {
      return phase1OnlyCourses;
    }

    // Return courses that can be paired with the other course (and are Phase 1)
    return (pairingsPhase1[otherCourse] || []).filter(id => courseData[id].phase === 1);
  };

  // Check if prerequisites are met for Phase 2
  const checkPhase2Prerequisites = (courseId) => {
    const prereq = phase2Prerequisites[courseId];
    if (!prereq) return true;

    const allSelectedCourses = [...phase1Courses, ...phase2Courses].filter(c => c !== '');

    if (prereq.type === 'all') {
      return prereq.courses.every(c => allSelectedCourses.includes(c));
    }

    if (prereq.type === 'any') {
      return prereq.courses.some(c => allSelectedCourses.includes(c));
    }

    return true;
  };

  // Check mandatory requirements for Phase 2
  const checkMandatoryRequirements = () => {
    const requirements = getPhase2Requirements();
    if (!requirements) return { requirementsNeeded: [], socialScienceCourses: [], scienceCourses: [] };
    
    const allSelected = [...phase1Courses, ...phase2Courses].filter(c => c !== '');
    
    const req1Courses = ['politik', 'philosophie', 'geschichte', 'erdkunde'];
    const req2Courses = ['mathe', 'biologie', 'chemie', 'physik', 'informatik'];
    
    // Check if Req1 is fulfilled
    const hasReq1 = requirements.req1 ? allSelected.some(c => req1Courses.includes(c)) : true;
    
    // Check if Req2 is fulfilled
    const hasReq2 = requirements.req2 ? allSelected.some(c => req2Courses.includes(c)) : true;
    
    // Check extra requirements
    let hasExtraReq = true;
    if (requirements.extraReq) {
      const extra = requirements.extraReq;
      
      if (extra.type === 'choose_one' || extra.type === 'conditional') {
        // Check if any of the required courses is in slots 3 or 4
        const slot3 = phase2Courses[0];
        const slot4 = phase2Courses[1];
        hasExtraReq = extra.courses.some(c => [slot3, slot4].includes(c));
        
        // Special handling for conditional requirements
        if (extra.condition === 'if_not_mathe_then_deutsch') {
          const hasMathe = allSelected.includes('mathe');
          if (hasMathe) {
            hasExtraReq = true; // Mathe fulfills both Req2 and extra req
          } else {
            hasExtraReq = [slot3, slot4].includes('deutsch');
          }
        } else if (extra.condition === 'if_not_mathe_then_fremdsprache') {
          const hasMathe = [slot3, slot4].includes('mathe');
          if (hasMathe) {
            hasExtraReq = true; // Mathe fulfills Req2
          } else {
            hasExtraReq = [slot3, slot4].includes('fremdsprache');
          }
        }
      } else if (extra.type === 'choose_two_of_three') {
        const slot3 = phase2Courses[0];
        const slot4 = phase2Courses[1];
        const selectedExtra = [slot3, slot4].filter(c => extra.courses.includes(c));
        hasExtraReq = selectedExtra.length >= 2;
      }
    }
    
    const requirementsNeeded = [];
    if (!hasReq1) requirementsNeeded.push('req1');
    if (!hasReq2) requirementsNeeded.push('req2');
    if (!hasExtraReq) requirementsNeeded.push('extra');
    
    return {
      needsReq1: !hasReq1,
      needsReq2: !hasReq2,
      needsExtraReq: !hasExtraReq,
      requirementsNeeded,
      socialScienceCourses: req1Courses,
      scienceCourses: req2Courses,
      requirements
    };
  };

  // Get available courses for Phase 2 for a specific slot
  const getAvailablePhase2CoursesForSlot = (slotIndex) => {
    const allSelected = [...phase1Courses, ...phase2Courses].filter(c => c !== '');
    const requirements = getPhase2Requirements();
    if (!requirements) return [];
    
    const reqCheck = checkMandatoryRequirements();
    const emptySlots = phase2Courses.filter(c => c === '').length;
    const requirementsCount = reqCheck.requirementsNeeded.length;
    
    // Get all courses that haven't been selected yet
    let availableCourses = Object.keys(courseData).filter(courseId => 
      !allSelected.includes(courseId)
    );
    
    // Slot-specific restrictions
    const slot = slotIndex + 3; // Convert to actual slot number (3, 4, 5)
    
    // Mathe, Deutsch, FremdSprache can only be in slots 3 or 4 (not 5)
    if (slot === 5) {
      availableCourses = availableCourses.filter(c => 
        !['mathe', 'deutsch', 'fremdsprache'].includes(c)
      );
    }
    
    // Smart filtering based on requirements
    if (requirementsCount > 0 && emptySlots === requirementsCount) {
      // Choices = Requirements: Show ONLY requirement courses
      const requiredCourses = [];
      
      if (reqCheck.needsReq1) {
        requiredCourses.push(...reqCheck.socialScienceCourses);
      }
      
      if (reqCheck.needsReq2) {
        requiredCourses.push(...reqCheck.scienceCourses);
        // Apply Mathe slot restriction for Req2
        if (slot === 5 && requiredCourses.includes('mathe')) {
          requiredCourses.splice(requiredCourses.indexOf('mathe'), 1);
        }
      }
      
      if (reqCheck.needsExtraReq && requirements.extraReq) {
        const extra = requirements.extraReq;
        
        // Only show extra req courses in their allowed slots
        if (extra.slots.includes(slot)) {
          requiredCourses.push(...extra.courses);
        }
      }
      
      availableCourses = availableCourses.filter(c => requiredCourses.includes(c));
    } else if (requirements.extraReq && reqCheck.needsExtraReq) {
      // Extra requirements still need to be fulfilled in specific slots
      const extra = requirements.extraReq;
      
      if (extra.slots.includes(slot)) {
        // This slot can have extra req courses
        const extraAvailable = availableCourses.filter(c => extra.courses.includes(c));
        
        if (extra.type === 'choose_two_of_three') {
          // Must choose in slots 3 and 4
          const otherSlot = slotIndex === 0 ? phase2Courses[1] : phase2Courses[0];
          const alreadyChosen = extra.courses.includes(otherSlot) ? 1 : 0;
          
          if (alreadyChosen < 2) {
            // Still need to choose from extra courses
            availableCourses = availableCourses.filter(c => 
              extra.courses.includes(c) || reqCheck.needsReq1 && reqCheck.socialScienceCourses.includes(c) ||
              reqCheck.needsReq2 && reqCheck.scienceCourses.includes(c)
            );
          }
        }
      }
    }
    
    return availableCourses;
  };

  // Handle Phase 1 course selection
  const handlePhase1Select = (position, courseId) => {
    const newPhase1 = [...phase1Courses];
    newPhase1[position] = courseId;
    setPhase1Courses(newPhase1);
    
    // If clearing a Phase 1 course, also clear all Phase 2 courses
    if (courseId === '') {
      setPhase2Courses(['', '', '']);
    }
  };

  // Handle Phase 2 course selection
  const handlePhase2Select = (position, courseId) => {
    const newPhase2 = [...phase2Courses];
    newPhase2[position] = courseId;
    setPhase2Courses(newPhase2);
  };

  // Check if Phase 2 is unlocked
  const isPhase2Unlocked = phase1Courses[0] && phase1Courses[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Course Selection System</h1>
          </div>
          <p className="text-gray-600 text-sm mb-2">
            <strong>Phase 1:</strong> Select 2 courses (order doesn't matter). Some combinations are restricted.
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Phase 2:</strong> Select 3 more courses (order doesn't matter). All courses become available again if prerequisites are met.
          </p>
        </div>

        {/* PHASE 1: First 2 Courses */}
        <div className="mb-8">
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-t-lg font-semibold">
            Phase 1: Select Your First 2 Courses
          </div>
          <div className="bg-white rounded-b-lg shadow-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              {[0, 1].map((position) => {
                const availableCourses = getAvailablePhase1Courses(position);
                const selectedCourse = phase1Courses[position];
                const otherCourse = phase1Courses[position === 0 ? 1 : 0];
                
                return (
                  <div key={position} className="border-2 border-indigo-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      Course {position + 1}
                    </h3>

                    <select
                      value={selectedCourse}
                      onChange={(e) => handlePhase1Select(position, e.target.value)}
                      className={`w-full p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCourse
                          ? 'bg-green-50 border-green-400 text-green-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-500 cursor-pointer'
                      }`}
                    >
                      <option value="">-- Select Course --</option>
                      {availableCourses.map((courseId) => (
                        <option key={courseId} value={courseId}>
                          {courseData[courseId].name}
                        </option>
                      ))}
                      
                      {/* Show unavailable courses as disabled */}
                      {Object.keys(courseData)
                        .filter(id => !availableCourses.includes(id) && id !== otherCourse)
                        .map((courseId) => (
                          <option key={courseId} value={courseId} disabled>
                            {courseData[courseId].name} - Not compatible
                          </option>
                        ))}
                    </select>

                    {selectedCourse && (
                      <div className="mt-3">
                        <button
                          onClick={() => handlePhase1Select(position, '')}
                          className="w-full text-sm bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                          Clear Selection
                        </button>
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                          <div className="font-semibold text-green-800">
                            {courseData[selectedCourse].name}
                          </div>
                          <div className="text-sm text-green-600">
                            Level {courseData[selectedCourse].level}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PHASE 2: Courses 3-5 */}
        <div className="mb-8">
          <div className={`px-4 py-2 rounded-t-lg font-semibold ${
            isPhase2Unlocked 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-400 text-gray-100'
          }`}>
            Phase 2: Select Your Next 3 Courses
            {!isPhase2Unlocked && ' (Complete Phase 1 first)'}
          </div>
          
          {/* Mandatory Requirements Display */}
          {isPhase2Unlocked && (() => {
            const reqCheck = checkMandatoryRequirements();
            const requirements = getPhase2Requirements();
            const emptySlots = phase2Courses.filter(c => c === '').length;
            const requirementsCount = reqCheck.requirementsNeeded.length;
            
            return (
              <div className="bg-yellow-50 border-b-2 border-yellow-300 p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Phase 2 Requirements: {requirementsCount} requirement(s) | {emptySlots} choice(s) left | {requirements?.beliebigen || 0} Beliebigen
                </h4>
                <div className="space-y-1 text-sm mb-3">
                  {requirements?.req1 && (
                    <div className={`flex items-center gap-2 ${
                      reqCheck.needsReq1 ? 'text-red-600 font-semibold' : 'text-green-600'
                    }`}>
                      {reqCheck.needsReq1 ? '❌' : '✅'}
                      Requirement 1: Must select ONE of Politik, Philosophie, Geschichte, or Erdkunde
                    </div>
                  )}
                  {requirements?.req2 && (
                    <div className={`flex items-center gap-2 ${
                      reqCheck.needsReq2 ? 'text-red-600 font-semibold' : 'text-green-600'
                    }`}>
                      {reqCheck.needsReq2 ? '❌' : '✅'}
                      Requirement 2: Must select ONE of Mathe, Biologie, Chemie, Physik, or Informatik
                      {requirements.mathSlots.length > 0 && ' (Mathe only in slots 3 or 4)'}
                    </div>
                  )}
                  {requirements?.extraReq && (
                    <div className={`flex items-center gap-2 ${
                      reqCheck.needsExtraReq ? 'text-orange-600 font-semibold' : 'text-green-600'
                    }`}>
                      {reqCheck.needsExtraReq ? '⚠️' : '✅'}
                      Extra Requirement: {requirements.extraReq.message}
                    </div>
                  )}
                </div>
                {emptySlots > requirementsCount && requirementsCount > 0 && (
                  <div className="text-sm bg-blue-100 text-blue-800 p-2 rounded">
                    💡 You have freedom to choose after fulfilling requirements
                  </div>
                )}
                {emptySlots === requirementsCount && requirementsCount > 0 && (
                  <div className="text-sm bg-orange-100 text-orange-800 p-2 rounded font-semibold">
                    ⚠️ Choices = Requirements: Must select from requirement courses only!
                  </div>
                )}
                {emptySlots === 0 && (
                  <div className="text-sm bg-green-100 text-green-800 p-2 rounded font-semibold">
                    ✅ All Phase 2 courses selected!
                  </div>
                )}
              </div>
            );
          })()}
          
          <div className={`bg-white rounded-b-lg shadow-lg p-6 ${
            !isPhase2Unlocked ? 'opacity-50' : ''
          }`}>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((position) => {
                const availableCourses = getAvailablePhase2CoursesForSlot(position);
                const selectedCourse = phase2Courses[position];
                const slotNum = position + 3;
                
                return (
                  <div key={position} className="border-2 border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      Course {slotNum} (Slot {slotNum})
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {slotNum === 5 ? '⚠️ Mathe/Deutsch/FremdSprache not allowed here' : '✓ All courses allowed'}
                    </p>

                    <select
                      value={selectedCourse}
                      onChange={(e) => handlePhase2Select(position, e.target.value)}
                      disabled={!isPhase2Unlocked}
                      className={`w-full p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        !isPhase2Unlocked
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : selectedCourse
                          ? 'bg-green-50 border-green-400 text-green-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-green-500 cursor-pointer'
                      }`}
                    >
                      <option value="">
                        {!isPhase2Unlocked ? 'Complete Phase 1 first' : '-- Select Course --'}
                      </option>
                      {isPhase2Unlocked && availableCourses.map((courseId) => (
                        <option key={courseId} value={courseId}>
                          {courseData[courseId].name}
                        </option>
                      ))}
                      
                      {/* Show unavailable courses as disabled */}
                      {isPhase2Unlocked && Object.keys(courseData)
                        .filter(id => !availableCourses.includes(id))
                        .map((courseId) => {
                          const allSelected = [...phase1Courses, ...phase2Courses].filter(c => c !== '');
                          if (allSelected.includes(courseId)) {
                            return (
                              <option key={courseId} value={courseId} disabled>
                                {courseData[courseId].name} - Already selected
                              </option>
                            );
                          }
                          if (slotNum === 5 && ['mathe', 'deutsch', 'fremdsprache'].includes(courseId)) {
                            return (
                              <option key={courseId} value={courseId} disabled>
                                {courseData[courseId].name} - Not allowed in slot 5
                              </option>
                            );
                          }
                          return (
                            <option key={courseId} value={courseId} disabled>
                              {courseData[courseId].name} - Not available
                            </option>
                          );
                        })}
                    </select>

                    {selectedCourse && (
                      <div className="mt-3">
                        <button
                          onClick={() => handlePhase2Select(position, '')}
                          className="w-full text-sm bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                          Clear Selection
                        </button>
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                          <div className="font-semibold text-green-800">
                            {courseData[selectedCourse].name}
                          </div>
                          <div className="text-sm text-green-600">
                            Level {courseData[selectedCourse].level}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Selection Summary</h2>
          
          {[...phase1Courses, ...phase2Courses].every(c => c === '') ? (
            <p className="text-gray-500 text-center py-8">No courses selected yet. Start with Phase 1!</p>
          ) : (
            <div className="space-y-2">
              {[...phase1Courses, ...phase2Courses].map((courseId, index) => {
                if (!courseId) return null;
                const course = courseData[courseId];
                const phase = index < 2 ? 'Phase 1' : 'Phase 2';
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                    <span className="text-sm font-bold text-green-700 min-w-[100px]">
                      Course {index + 1}:
                    </span>
                    <span className="font-semibold text-gray-800">{course.name}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded ml-auto">
                      {phase}
                    </span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                      Level {course.level}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {([...phase1Courses, ...phase2Courses].some(c => c !== '')) && (
            <button
              onClick={() => {
                setPhase1Courses(['', '']);
                setPhase2Courses(['', '', '']);
              }}
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Reset All Selections
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default CourseSelector;
