import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Clearing old data...');
  await prisma.activityEvent.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('1234567', 10);

  // เอาฟิลด์ bmi ออก เหลือแค่ weight, height และ medicalNotes ตาม Schema
  const usersData = [
    { name: 'John Doe', email: 'john@example.com', password: hashedPassword, gender: 'Male', bio: 'Love running', weight: 75, height: 180, medicalNotes: 'None' },
    { name: 'Jane Smith', email: 'jane@example.com', password: hashedPassword, gender: 'Female', bio: 'Yoga enthusiast', weight: 55, height: 165, medicalNotes: 'No medical notes provided.' },
    { name: 'Somchai', email: 'somchai@example.com', password: hashedPassword, gender: 'Male', bio: 'Futsal player', weight: 70, height: 175, medicalNotes: 'None' },
    { name: 'Somsri', email: 'somsri@example.com', password: hashedPassword, gender: 'Female', bio: 'Badminton lover', weight: 50, height: 160, medicalNotes: 'Allergic to dust' },
    { name: 'Mana', email: 'mana@example.com', password: hashedPassword, gender: 'Male', bio: 'Gym rat', weight: 80, height: 185, medicalNotes: 'No medical notes provided.' },
    { name: 'Prem', email: 'prem@example.com', password: hashedPassword, gender: 'Male', bio: 'Marathon trainee', weight: 68, height: 172, medicalNotes: 'None' },
    { name: 'Phum', email: 'phum@example.com', password: hashedPassword, gender: 'Male', bio: 'Casual runner', weight: 72, height: 178, medicalNotes: 'None' },
    { name: 'Pim', email: 'pim@example.com', password: hashedPassword, gender: 'Female', bio: 'Pilates and cardio', weight: 48, height: 158, medicalNotes: 'No medical notes provided.' },
    { name: 'Art', email: 'art@example.com', password: hashedPassword, gender: 'Male', bio: 'Powerlifter', weight: 85, height: 182, medicalNotes: 'None' },
    { name: 'Niti', email: 'niti@example.com', password: hashedPassword, gender: 'Male', bio: 'Weekend cyclist', weight: 65, height: 170, medicalNotes: 'None' },
    { name: 'Kanya', email: 'kanya@example.com', password: hashedPassword, gender: 'Female', bio: 'Zumba dancer', weight: 52, height: 162, medicalNotes: 'None' },
    { name: 'Wichai', email: 'wichai@example.com', password: hashedPassword, gender: 'Male', bio: 'Basketball player', weight: 78, height: 176, medicalNotes: 'Previous knee injury' },
    { name: 'Sunisa', email: 'sunisa@example.com', password: hashedPassword, gender: 'Female', bio: 'HIIT lover', weight: 54, height: 164, medicalNotes: 'None' },
    { name: 'Pongsak', email: 'pongsak@example.com', password: hashedPassword, gender: 'Male', bio: 'Swimming enthusiast', weight: 82, height: 180, medicalNotes: 'None' },
    { name: 'Mali', email: 'mali@example.com', password: hashedPassword, gender: 'Female', bio: 'Morning jogger', weight: 45, height: 155, medicalNotes: 'No medical notes provided.' }
  ];

  const users = await Promise.all(
    usersData.map(user => prisma.user.create({ data: user }))
  );

  console.log('Seeding activities...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeekend = new Date(today);
  nextWeekend.setDate(nextWeekend.getDate() + 5);

  const activitiesData = [
    {
      title: 'หาเพื่อนวิ่ง City Run ชิลๆ',
      description: 'วิ่งเหยาะๆ 5-10km เน้นชมเมือง ไม่เน้นเพซ',
      locationName: 'สวนลุมพินี',
      locationUrl: '',
      eventDate: tomorrow,
      startTime: '18:00',
      endTime: '20:00',
      category: 'Running',
      maxParticipants: 5,
      hostId: users[5].id, // Prem
      imgEvent: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'เตะบอลหญ้าเทียม',
      description: 'ขาด 3 คนครับ เตะกระชับมิตร หารค่าสนามกัน',
      locationName: 'สนามฟุตบอล Soccer Pro',
      locationUrl: '',
      eventDate: tomorrow,
      startTime: '19:00',
      endTime: '21:00',
      category: 'Football',
      maxParticipants: 14,
      hostId: users[2].id, // Somchai
      imgEvent: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'ตีแบดมินตัน หลังเลิกงาน',
      description: 'จองคอร์ทไว้แล้ว 2 ชั่วโมง ชวนเพื่อนมาตีเหงื่อออกด้วยกัน',
      locationName: 'สนามแบดมินตัน 71',
      locationUrl: '',
      eventDate: nextWeekend,
      startTime: '19:00',
      endTime: '21:00',
      category: 'Badminton',
      maxParticipants: 6,
      hostId: users[3].id, // Somsri
      imgEvent: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'ปั่นจักรยานรับลม',
      description: 'ปั่น 2 รอบเบาๆ แวะพักดื่มน้ำพูดคุยกัน',
      locationName: 'สกายเลน สุวรรณภูมิ',
      locationUrl: '',
      eventDate: nextWeekend,
      startTime: '16:00',
      endTime: '18:30',
      category: 'Cycling',
      maxParticipants: 10,
      hostId: users[9].id, // Niti
      imgEvent: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'ฟิตเนสยกเหล็กเย็นนี้',
      description: 'หาบัดดี้ช่วยเซฟตอนเล่นอก/ไหล่ครับ',
      locationName: 'Jetts Fitness',
      locationUrl: '',
      eventDate: tomorrow,
      startTime: '20:00',
      endTime: '22:00',
      category: 'Fitness',
      maxParticipants: 2,
      hostId: users[4].id, // Mana
      imgEvent: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'โยคะยามเช้า',
      description: 'นำเสื่อมาเองนะครับ ยืดเหยียดรับแดดเช้า',
      locationName: 'สวนเบญจกิติ',
      locationUrl: '',
      eventDate: nextWeekend,
      startTime: '07:00',
      endTime: '08:30',
      category: 'Yoga',
      maxParticipants: 8,
      hostId: users[1].id, // Jane
      imgEvent: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'บาสเกตบอล 3v3',
      description: 'หาตี้เล่นบาสครึ่งสนามครับ ระดับเล่นเพื่อสุขภาพ',
      locationName: 'สนามบาสกกท.',
      locationUrl: '',
      eventDate: tomorrow,
      startTime: '17:30',
      endTime: '19:30',
      category: 'Basketball',
      maxParticipants: 6,
      hostId: users[11].id, // Wichai
      imgEvent: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'คลาส HIIT เบิร์นไขมัน',
      description: 'นัดรวมกลุ่มเต้นและบอดี้เวทหนักๆ 45 นาที',
      locationName: 'ลานกีฬาอุทยาน 100 ปี จุฬาฯ',
      locationUrl: '',
      eventDate: nextWeekend,
      startTime: '18:00',
      endTime: '19:00',
      category: 'Fitness',
      maxParticipants: 12,
      hostId: users[12].id, // Sunisa
      imgEvent: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  for (const activity of activitiesData) {
    await prisma.activityEvent.create({ data: activity });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });