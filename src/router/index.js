import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ScientificProfile from "../views/ScientificProfile.vue";
import ResearchCooperation from "../views/ResearchCooperation.vue";
import Contests from "../views/Contests.vue";
import Products from "../views/Products.vue";
import LoginForm from "../views/LoginForm.vue";
import PersonalInfo from "../views/PersonalInfo.vue";
import Education from "../views/EducationForm.vue";
import WorkExperience from "../views/WorkExperience.vue";
import ResearchProjects from "../views/ResearchProjects.vue";
import Publications from "../views/Publications.vue";
import Patents from "../views/Patents.vue";
import RegisterForm from "@/views/RegisterForm.vue";
import AuthCallback from "../views/AuthCallback.vue";
import ConfirmRegistration from '../views/ConfirmRegistration.vue'
import UserProfile from '@/views/UserProfile.vue';


const routes = [
  { path: "/", name: "home", component: Home },
  {
    path: "/scientific-profile",
    name: "scientificProfile",
    component: ScientificProfile,
  },
  {
    path: "/research-cooperation",
    name: "researchCooperation",
    component: ResearchCooperation,
  },
  {
    path: "/research-collaboration",
    name: "researchCollaboration",
    component: ResearchCooperation,
  },
  { path: "/contests", name: "contests", component: Contests },
  { path: "/products", name: "products", component: Products },
  { path: "/login", name: "login", component: LoginForm },
  { path: "/register", name: "register", component: RegisterForm },
  { path: "/personal-info", name: "personalInfo", component: PersonalInfo },
  { path: "/education", name: "education", component: Education },
  {
    path: "/work-experience",
    name: "workExperience",
    component: WorkExperience,
  },
  { path: "/work-process", name: "workProcess", component: WorkExperience },
  {
    path: "/research-projects",
    name: "researchProjects",
    component: ResearchProjects,
  },
  { path: "/publications", name: "publications", component: Publications },
  {
    path: "/scientific-publications",
    name: "scientificPublications",
    component: Publications,
  },
  { path: "/patents", name: "patents", component: Patents },
  {
    path: "/auth/callback",
    name: "AuthCallback",
    component: AuthCallback,
  },
  {
    path: '/confirm-registration',
    name: 'ConfirmRegistration',
    component: ConfirmRegistration
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: "/user/:id", // Nhận ID từ URL
    name: "UserProfile",
    component: UserProfile,
    props: true, // Truyền props từ URL
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


export default router;
