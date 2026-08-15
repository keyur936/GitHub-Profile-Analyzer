import { useEffect } from 'react';

export default function SEOHead({ title, description }) {
  useEffect(() => {
    // Update Title
    if (title) {
      document.title = `${title} | GitHub Profile Analyzer`;
    } else {
      document.title = 'GitHub Profile Analyzer | Turn Profiles Into Developer Reports';
    }

    // Update Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        description ||
          'Free tool to analyze any public GitHub profile. Get comprehensive developer reports, repository language statistics, contribution timelines, activity scores, and developer insights.'
      );
    }

    // Update OpenGraph Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | GitHub Profile Analyzer` : 'GitHub Profile Analyzer');
    }
  }, [title, description]);

  return null;
}
