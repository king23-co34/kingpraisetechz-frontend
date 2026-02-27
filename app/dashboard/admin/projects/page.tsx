"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, FolderKanban, Calendar, DollarSign,
  Users, ChevronRight, Upload, X, Trash2, UserPlus
} from "lucide-react";
import {
  StatsCard, Badge, ProgressBar, SectionHeader, Card, Button,
  Modal, Input, Textarea, Select, EmptyState, Skeleton
} from "@/components/ui";
import { projectsAPI, teamAPI } from "@/lib/api";
import { Project, TeamMember } from "@/types";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
];

interface TaskInput {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  payment: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    clientEmail: "",
    clientName: "",
    budget: "",
    deliveryDate: "",
    status: "planning",
    category: "",
  });

  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    order: "1",
  });

  useEffect(() => {
    fetchProjects();
    fetchTeam();
  }, [statusFilter]);

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data.projects || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await teamAPI.getAll();
      setTeamMembers(res.data.members || []);
    } catch {
      setTeamMembers([]);
    }
  };

  const addTask = () => {
    setTasks([...tasks, { title: "", description: "", assignedTo: "", dueDate: "", payment: "" }]);
  };

  const removeTask = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const updateTask = (idx: number, field: keyof TaskInput, value: string) => {
    const updated = [...tasks];
    updated[idx][field] = value;
    setTasks(updated);
  };

  const handleCreateProject = async () => {
    if (!form.title || !form.clientEmail || !form.budget || !form.deliveryDate) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await projectsAPI.create({
        ...form,
        budget: parseFloat(form.budget),
        tasks: tasks.map(t => ({ ...t, payment: parseFloat(t.payment) })),
      });
      toast.success("Project created and client notified!");
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch {
      toast.error("Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      await projectsAPI.uploadMilestone(selectedProject.id, {
        ...milestoneForm,
        order: parseInt(milestoneForm.order),
      });
      toast.success("Milestone added and client notified by email!");
      setShowMilestoneModal(false);
      setMilestoneForm({ title: "", description: "", dueDate: "", order: "1" });
      fetchProjects();
    } catch {
      toast.error("Failed to add milestone");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", clientEmail: "", clientName: "", budget: "", deliveryDate: "", status: "planning", category: "" });
    setTasks([]);
  };

  const filtered = projects.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Manage all agency projects</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-dark px-4 py-2.5 rounded-xl text-sm cursor-pointer"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#1a1a2e" }}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-52" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={28} />}
          title="No projects found"
          description="Create your first project to get started"
          action={<Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowModal(true)}>Create Project</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 card-hover group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-white text-base truncate">{project.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{project.clientName}</p>
                </div>
                <Badge variant={
                  project.status === "completed" ? "success" :
                    project.status === "in-progress" ? "warning" :
                      project.status === "on-hold" ? "danger" : "info"
                }>
                  {project.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <DollarSign size={12} className="text-gold-400" />
                  <span>{formatCurrency(project.budget)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar size={12} className="text-brand-400" />
                  <span>{formatDate(project.deliveryDate)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users size={12} className="text-emerald-400" />
                  <span>{project.assignedTeam?.length || 0} members</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <FolderKanban size={12} className="text-purple-400" />
                  <span>{project.tasks?.length || 0} tasks</span>
                </div>
              </div>

              <ProgressBar value={project.progress} showLabel />

              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setSelectedProject(project); setShowMilestoneModal(true); }}
                >
                  + Milestone
                </Button>
                <Link href={`/dashboard/admin/projects/${project.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">View</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); resetForm(); }} title="Create New Project" size="xl">
        <div className="space-y-6">
          {/* Project Info */}
          <div>
            <p className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Project Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input label="Project Title *" placeholder="e.g., E-commerce Website Redesign" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Textarea label="Description" placeholder="Describe the project scope..." value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Input label="Budget (NGN) *" type="number" placeholder="e.g., 500000" prefix={<DollarSign size={14} />} value={form.budget} onChange={(e: any) => setForm({ ...form, budget: e.target.value })} />
              <Input label="Delivery Date *" type="date" value={form.deliveryDate} onChange={(e: any) => setForm({ ...form, deliveryDate: e.target.value })} />
              <Input label="Category" placeholder="e.g., Web Development" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} />
              <Select
                label="Initial Status"
                options={statusOptions.slice(1)}
                value={form.status}
                onChange={(e: any) => setForm({ ...form, status: e.target.value })}
              />
            </div>
          </div>

          {/* Client Info */}
          <div>
            <p className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Client Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Client Name *" placeholder="John Adeyemi" value={form.clientName} onChange={(e: any) => setForm({ ...form, clientName: e.target.value })} />
              <Input label="Client Email *" type="email" placeholder="client@example.com" value={form.clientEmail} onChange={(e: any) => setForm({ ...form, clientEmail: e.target.value })} />
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Assign Tasks</p>
              <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addTask}>Add Task</Button>
            </div>
            {tasks.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-xl p-6 text-center">
                <UserPlus size={24} className="mx-auto mb-2 text-slate-600" />
                <p className="text-slate-500 text-sm">No tasks yet. Add tasks to assign to team members.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300">Task {idx + 1}</span>
                      <button onClick={() => removeTask(idx)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input placeholder="Task title *" value={task.title} onChange={(e: any) => updateTask(idx, "title", e.target.value)} />
                      <select
                        value={task.assignedTo}
                        onChange={(e) => updateTask(idx, "assignedTo", e.target.value)}
                        className="input-dark px-4 py-3 rounded-xl text-sm"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <option value="" style={{ background: "#1a1a2e" }}>Assign to team member...</option>
                        {teamMembers.map((m) => (
                          <option key={m.id} value={m.id} style={{ background: "#1a1a2e" }}>{m.name} — {m.role}</option>
                        ))}
                      </select>
                      <Input placeholder="Due date" type="date" value={task.dueDate} onChange={(e: any) => updateTask(idx, "dueDate", e.target.value)} />
                      <Input placeholder="Payment (NGN)" type="number" prefix={<DollarSign size={14} />} value={task.payment} onChange={(e: any) => updateTask(idx, "payment", e.target.value)} />
                      <div className="sm:col-span-2">
                        <Textarea placeholder="Task description..." value={task.description} onChange={(e: any) => updateTask(idx, "description", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button variant="primary" className="flex-1" loading={submitting} onClick={handleCreateProject}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Milestone Modal */}
      <Modal open={showMilestoneModal} onClose={() => setShowMilestoneModal(false)} title={`Add Milestone — ${selectedProject?.title}`} size="md">
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/20">
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Upload size={12} className="text-brand-400" />
              This milestone will be sent to the client's email and displayed on their dashboard.
            </p>
          </div>

          <Input label="Milestone Title *" placeholder="e.g., Design Mockups Completed" value={milestoneForm.title} onChange={(e: any) => setMilestoneForm({ ...milestoneForm, title: e.target.value })} />
          <Textarea label="Description" placeholder="Describe what was achieved..." value={milestoneForm.description} onChange={(e: any) => setMilestoneForm({ ...milestoneForm, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Due Date *" type="date" value={milestoneForm.dueDate} onChange={(e: any) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })} />
            <Input label="Order" type="number" value={milestoneForm.order} onChange={(e: any) => setMilestoneForm({ ...milestoneForm, order: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowMilestoneModal(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" loading={submitting} onClick={handleAddMilestone}>
              Add Milestone
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
