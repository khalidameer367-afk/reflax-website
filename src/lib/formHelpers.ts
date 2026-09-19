export function parseFreelancerFormData(form: HTMLFormElement) {
  const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
  return {
    full_name: data.full_name,
    phone: data.phone || null,
    category: data.category,
    title: data.title,
    bio: data.bio,
    skills: data.skills
      ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    experience_years: data.experience_years ? Number(data.experience_years) : null,
    hourly_rate: data.hourly_rate || null,
    location: data.location || null,
    portfolio_url: data.portfolio_url || null,
    linkedin_url: data.linkedin_url || null,
  };
}
