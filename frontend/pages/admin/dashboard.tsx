import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Briefcase,
  TrendingUp,
  Star,
  Plus,
  Settings,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { withAdminProtection } from '@/components/withAdminProtection';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  location?: string;
  job_title?: string;
  experience_level?: string;
  created_at: string;
  updated_at: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted_at: string;
  featured: boolean;
  urgent: boolean;
  remote: boolean;
  accept_applications: boolean;
}

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  activeJobs: number;
  featuredJobs: number;
  newUsersThisMonth: number;
  jobApplications: number;
}

// ✅ Centralized API base for CORS and deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const AdminDashboard = () => {
  const { isAdmin, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    featuredJobs: 0,
    newUsersThisMonth: 0,
    jobApplications: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/admin');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ Type-safe headers
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const [statsResponse, usersResponse, jobsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/dashboard`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/users`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/jobs`, { headers }),
      ]);

      if (statsResponse.ok && usersResponse.ok && jobsResponse.ok) {
        const [statsData, usersData, jobsData] = await Promise.all([
          statsResponse.json(),
          usersResponse.json(),
          jobsResponse.json(),
        ]);
        setStats(statsData);
        setRecentUsers(usersData);
        setRecentJobs(jobsData);
      } else {
        // fallback dummy data
        setStats({
          totalUsers: 1247,
          totalJobs: 89,
          activeJobs: 76,
          featuredJobs: 12,
          newUsersThisMonth: 156,
          jobApplications: 423,
        });
        setRecentUsers([
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@email.com',
            role: 'ROLE_USER',
            location: 'New York, NY',
            job_title: 'Frontend Developer',
            experience_level: 'Senior Level',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setRecentJobs([
          {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'New York, NY',
            type: 'Full-time',
            salary: '$120k - $160k',
            posted_at: new Date().toISOString(),
            featured: true,
            urgent: false,
            remote: true,
            accept_applications: true,
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    trend,
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    trend?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {trend && <span className="text-green-600">{trend}</span>} {description}
        </p>
      </CardContent>
    </Card>
  );

  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your platform and monitor key metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/jobs/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          description="registered users"
          icon={Users}
          trend="+12%"
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          description="job listings"
          icon={Briefcase}
          trend="+8%"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          description="accepting applications"
          icon={TrendingUp}
        />
        <StatCard
          title="Featured Jobs"
          value={stats.featuredJobs}
          description="premium listings"
          icon={Star}
        />
      </div>

      {/* Recent Activity */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Registered Users</CardTitle>
              <CardDescription>New users who joined the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {user.first_name} {user.last_name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {user.experience_level && (
                          <Badge variant="outline">{user.experience_level}</Badge>
                        )}
                        {user.location && (
                          <span className="text-xs text-muted-foreground">
                            {user.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/users/${user.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Posted Jobs</CardTitle>
              <CardDescription>Latest job listings on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.company} • {job.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{job.type}</Badge>
                        {job.featured && <Badge variant="secondary">Featured</Badge>}
                        {job.remote && <Badge variant="outline">Remote</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(job.posted_at).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/jobs/${job.id}`}>Manage</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default withAdminProtection(AdminDashboard);
