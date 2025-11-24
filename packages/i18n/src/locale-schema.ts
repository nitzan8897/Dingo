export interface LocaleSchema {
  common: {
    appName: string;
    loading: string;
    error: string;
    noResults: string;
  };
  home: {
    title: string;
    subtitle: string;
    loadingLawyers: string;
    noLawyersFound: string;
  };
  search: {
    placeholder: string;
    searchSpecialties: string;
    allSpecialties: string;
    filterByCity: string;
    specialty: string;
    specialties: string;
    chooseSpecialties: string;
    clearAll: string;
    city: string;
  };
  specialties: {
    CRIMINAL: string;
    CIVIL: string;
    CORPORATE: string;
    FAMILY: string;
    LABOR: string;
    TAX: string;
    IMMIGRATION: string;
    REAL_ESTATE: string;
    INTELLECTUAL_PROPERTY: string;
  };
  lawyer: {
    overall: string;
    yearsOfExperience: string;
    specialties: string;
    ratings: string;
    about: string;
    contact: string;
    viewProfile: string;
    cases: string;
    reviews: string;
    featuredCases: string;
    noCases: string;
    noReviews: string;
    reviewsCount: string;
  };
  ratings: {
    professionalism: string;
    availability: string;
    empathy: string;
    cost: string;
    overall: string;
  };
  caseOutcome: {
    WON: string;
    LOST: string;
    SETTLED: string;
    ONGOING: string;
  };
  caseResult: {
    DEFENCE_WON: string;
    ATTACK_WON: string;
    settlement: string;
    dismissed: string;
    other: string;
  };
  case: {
    title: string;
    searchPlaceholder: string;
    filterBySpecialty: string;
    filterByStatus: string;
    filterByYear: string;
    filterByName: string;
    allCases: string;
    noCasesFound: string;
    caseDetails: string;
    judge: string;
    status: string;
    specialty: string;
    year: string;
    openedDate: string;
    closedDate: string;
    viewPDF: string;
    plaintiffLawyers: string;
    defendantLawyers: string;
    associatedLawyers: string;
    complexityScore: string;
    noLawyersAssociated: string;
  };
  chart: {
    caseOutcomes: string;
  };
  language: {
    he: string;
    en: string;
    switchLanguage: string;
  };
  metadata: {
    title: string;
    description: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
}
