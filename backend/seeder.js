const HeroSlide = require('./models/HeroSlide');

const slides = [
    {
        titleArabic: 'تمور الإخلاص.. ذهب الأحساء في بيتك',
        subtitleArabic: 'أجود أنواع التمور السعودية',
        imagePath: '/assets/hero/slide1.jpg',
        link: '/dates',
        order: 1,
    },
    {
        titleArabic: 'عجوة المدينة.. بركة من أرض طيبة',
        subtitleArabic: 'تمور مباركة من المدينة المنورة',
        imagePath: '/assets/hero/slide2.jpg',
        link: '/dates',
        order: 2,
    },
    {
        titleArabic: 'العود الملكي.. عبق التراث السعودي',
        subtitleArabic: 'عود فاخر يليق بمقامكم',
        imagePath: '/assets/hero/slide3.jpg',
        link: '/oud',
        order: 3,
    },
];

const seedHeroSlides = async () => {
    try {
        await HeroSlide.deleteMany();
        await HeroSlide.insertMany(slides);
        console.log('Hero Slides Seeded!');
    } catch (error) {
        console.error(`Error seeding slides: ${error}`);
        process.exit(1);
    }
};

module.exports = seedHeroSlides;
