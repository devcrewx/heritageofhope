import json, re

with open('packages/web/public/content-fallback.json') as f:
    api = json.load(f)

def resolve(val):
    if val is None:
        return ''
    if isinstance(val, str):
        return val
    if isinstance(val, dict):
        return {'en': val.get('en', ''), 'bn': val.get('bn', '')}
    return str(val)

def site_meta(api):
    sm = api.get('siteMeta', {})
    out = {}
    for k in ['orgName', 'logoUrl', 'phone', 'email', 'facebookUrl', 'estYear']:
        out[k] = sm.get(k, '')
    for k in ['navSubtitle', 'address', 'footerMission', 'registeredBadge',
              'donateButtonLabel', 'facebookLabel', 'hamburgerAriaLabel', 'navAriaLabel']:
        out[k] = resolve(sm.get(k, ''))
    return out

def home_section(api):
    h = api.get('home', {})
    hero = h.get('hero', {})
    pc = h.get('pageContent', {})
    return {
        'hero': {
            'eyebrow': resolve(hero.get('eyebrow', '')),
            'headline': resolve(hero.get('headline', '')),
            'intro': resolve(hero.get('intro', '')),
            'heroFootnote': resolve(hero.get('heroFootnote', '')),
            'heroImage': hero.get('heroImage', ''),
            'regCertThumb': hero.get('regCertThumb', ''),
            'figcaption': resolve(hero.get('figcaption', '')),
            'ctaPrimaryLabel': resolve(hero.get('ctaPrimaryLabel', '')),
            'ctaSecondaryLabel': resolve(hero.get('ctaSecondaryLabel', '')),
            'certCaption': resolve(hero.get('certCaption', '')),
        },
        'trustBadges': [resolve(b) for b in h.get('trustBadges', [])],
        'pageContent': {
            'statsLabel': resolve(pc.get('statsLabel', '')),
            'statsHeading': resolve(pc.get('statsHeading', '')),
            'pillarLabel': resolve(pc.get('pillarLabel', '')),
            'activityLabel': resolve(pc.get('activityLabel', '')),
            'activityHeading': resolve(pc.get('activityHeading', '')),
            'donationLabel': resolve(pc.get('donationLabel', '')),
        },
        'impactMetrics': [
            {'value': m.get('value', ''), 'label': resolve(m.get('label', ''))}
            for m in h.get('impactMetrics', [])
        ],
        'featuredPrograms': [
            {'slug': p.get('slug', ''), 'image': p.get('image', ''),
             'category': resolve(p.get('category', '')), 'title': resolve(p.get('title', '')),
             'description': resolve(p.get('description', '')), 'highlight': resolve(p.get('highlight', ''))}
            for p in h.get('featuredPrograms', [])
        ],
        'facebookPosts': [
            {'date': p.get('date', ''), 'title': resolve(p.get('title', '')),
             'excerpt': resolve(p.get('excerpt', '')), 'image': p.get('image', '')}
            for p in h.get('facebookPosts', [])
        ],
        'showcaseImages': [
            {'image': img.get('image', ''), 'label': resolve(img.get('label', ''))}
            for img in h.get('showcaseImages', [])
        ],
        'mission': {'heading': resolve(h.get('mission', {}).get('heading', ''))},
        'cta': {
            'headline': resolve(h.get('cta', {}).get('headline', '')),
            'body': resolve(h.get('cta', {}).get('body', '')),
            'buttonLabel': resolve(h.get('cta', {}).get('buttonLabel', '')),
        },
    }

def about_section(api):
    a = api.get('about', {})
    hero = a.get('hero', {})
    pc = a.get('pageContent', {})
    return {
        'hero': {'pageTitle': resolve(hero.get('pageTitle', '')), 'intro': resolve(hero.get('intro', '')), 'heroImage': hero.get('heroImage', '')},
        'pageContent': {
            'eyebrow': resolve(pc.get('eyebrow', '')), 'storyLabel': resolve(pc.get('storyLabel', '')),
            'missionLabel': resolve(pc.get('missionLabel', '')), 'visionLabel': resolve(pc.get('visionLabel', '')),
            'valuesLabel': resolve(pc.get('valuesLabel', '')), 'valuesHeading': resolve(pc.get('valuesHeading', '')),
            'regLabel': resolve(pc.get('regLabel', '')), 'regHeading': resolve(pc.get('regHeading', '')),
            'certLabel': resolve(pc.get('certLabel', '')), 'partnersLabel': resolve(pc.get('partnersLabel', '')),
            'teamLabel': resolve(pc.get('teamLabel', '')), 'teamHeading': resolve(pc.get('teamHeading', '')),
            'documentsLabel': resolve(pc.get('documentsLabel', '')), 'documentsHeading': resolve(pc.get('documentsHeading', '')),
        },
        'story': {'heading': resolve(a.get('story', {}).get('heading', '')), 'body': resolve(a.get('story', {}).get('body', ''))},
        'mission': resolve(a.get('mission', '')), 'vision': resolve(a.get('vision', '')),
        'values': [{'title': resolve(v.get('title', '')), 'description': resolve(v.get('description', ''))} for v in a.get('values', [])],
        'teamMembers': [{'image': m.get('image', ''), 'name': resolve(m.get('name', '')), 'role': resolve(m.get('role', ''))} for m in a.get('teamMembers', [])],
        'documents': a.get('documents', []), 'partners': a.get('partners', []),
        'registration': {'body': resolve(a.get('registration', {}).get('body', '')), 'certImage': a.get('registration', {}).get('certImage', '')},
    }

def ourwork_section(api):
    o = api.get('ourWork', {})
    hero = o.get('hero', {})
    pc = o.get('pageContent', {})
    return {
        'hero': {'pageTitle': resolve(hero.get('pageTitle', '')), 'intro': resolve(hero.get('intro', ''))},
        'pageContent': {'eyebrow': resolve(pc.get('eyebrow', '')), 'approachLabel': resolve(pc.get('approachLabel', '')), 'focusLabel': resolve(pc.get('focusLabel', '')), 'joinLabel': resolve(pc.get('joinLabel', ''))},
        'focusTags': [{'tag': resolve(t.get('tag', ''))} for t in o.get('focusTags', [])],
        'featuredPrograms': [{'slug': p.get('slug', ''), 'image': p.get('image', ''), 'category': resolve(p.get('category', '')), 'title': resolve(p.get('title', '')), 'description': resolve(p.get('description', '')), 'highlight': resolve(p.get('highlight', ''))} for p in o.get('featuredPrograms', [])],
        'approach': {'heading': resolve(o.get('approach', {}).get('heading', '')), 'steps': [resolve(s) for s in o.get('approach', {}).get('steps', [])]},
        'joinBox': {'body': resolve(o.get('joinBox', {}).get('body', '')), 'buttonLabel': resolve(o.get('joinBox', {}).get('buttonLabel', ''))},
        'showcaseImages': [{'image': img.get('image', ''), 'label': resolve(img.get('label', ''))} for img in o.get('showcaseImages', [])],
    }

def impact_section(api):
    imp = api.get('impact', {})
    hero = imp.get('hero', {})
    pc = imp.get('pageContent', {})
    return {
        'hero': {'pageTitle': resolve(hero.get('pageTitle', '')), 'subHeadline': resolve(hero.get('subHeadline', '')), 'promise': resolve(hero.get('promise', ''))},
        'pageContent': {'eyebrow': resolve(pc.get('eyebrow', '')), 'promiseLabel': resolve(pc.get('promiseLabel', '')), 'fundLabel': resolve(pc.get('fundLabel', '')), 'fundHeading': resolve(pc.get('fundHeading', '')), 'feedbackLabel': resolve(pc.get('feedbackLabel', '')), 'reportLabel': resolve(pc.get('reportLabel', ''))},
        'impactMetrics': [{'value': m.get('value', ''), 'label': resolve(m.get('label', ''))} for m in imp.get('impactMetrics', [])],
        'fundAllocation': imp.get('fundAllocation', []),
        'testimonial': {'quote': resolve(imp.get('testimonial', {}).get('quote', ''))},
        'annualReport': {'body': resolve(imp.get('annualReport', {}).get('body', ''))},
    }

def gallery_section(api):
    g = api.get('gallery', {})
    pc = g.get('pageContent', {})
    return {
        'pageContent': {k: resolve(pc.get(k, '')) for k in ['eyebrow', 'heading', 'intro', 'filterLabel', 'filterText', 'filterChipAll', 'filterChipEducation', 'filterChipHealthcare', 'filterChipWelfare', 'filterAriaLabel']},
        'items': g.get('items', []),
    }

def getinvolved_section(api):
    gi = api.get('getInvolved', {})
    hero = gi.get('hero', {})
    pc = gi.get('pageContent', {})
    return {
        'hero': {'pageTitle': resolve(hero.get('pageTitle', '')), 'intro': resolve(hero.get('intro', ''))},
        'pageContent': {k: resolve(pc.get(k, '')) for k in ['eyebrow', 'donationLabel', 'donationHeading', 'paymentLabel', 'paymentHeading', 'volunteerLabel', 'volunteerHeading', 'volunteerFormLabel', 'volunteerFormHeading', 'partnerLabel', 'partnerHeading', 'partnerSubtitle', 'partnerFormLabel', 'partnerFormHeading', 'bankLabel', 'chequeModalTitle', 'chequeButtonLabel']},
        'bankDetails': gi.get('bankDetails', {}), 'upiImage': gi.get('upiImage', ''), 'upiDeepLink': gi.get('upiDeepLink', ''),
        'donationTiers': gi.get('donationTiers', []),
        'volunteer': {'heading': resolve(gi.get('volunteer', {}).get('heading', '')), 'description': resolve(gi.get('volunteer', {}).get('description', '')), 'roles': gi.get('volunteer', {}).get('roles', [])},
        'volunteerFormLabels': gi.get('volunteerFormLabels', {}), 'partnerFormLabels': gi.get('partnerFormLabels', {}), 'upiLabels': gi.get('upiLabels', {}),
        'partnerSection': {'heading': resolve(gi.get('partnerSection', {}).get('heading', '')), 'body': resolve(gi.get('partnerSection', {}).get('body', '')), 'image': gi.get('partnerSection', {}).get('image', '')},
        'specimenChequeImage': gi.get('specimenChequeImage', ''),
    }

def contact_section(api):
    c = api.get('contact', {})
    pc = c.get('pageContent', {})
    return {
        'pageTitle': resolve(c.get('pageTitle', '')), 'intro': resolve(c.get('intro', '')),
        'responseLabel': resolve(c.get('responseLabel', '')), 'responseValue': resolve(c.get('responseValue', '')),
        'formLabel': resolve(c.get('formLabel', '')), 'formHeading': resolve(c.get('formHeading', '')),
        'phoneLabel': resolve(c.get('phoneLabel', '')), 'emailLabel': resolve(c.get('emailLabel', '')),
        'addressLabel': resolve(c.get('addressLabel', '')), 'visitFacebookLabel': resolve(c.get('visitFacebookLabel', '')),
        'mapTitle': resolve(c.get('mapTitle', '')),
        'pageContent': {k: resolve(pc.get(k, '')) for k in ['eyebrow', 'facebookLabel', 'facebookHeading']},
        'mapEmbedUrl': c.get('mapEmbedUrl', ''), 'formLabels': c.get('formLabels', {}),
        'mosaicImages': c.get('mosaicImages', []), 'facebookPosts': c.get('facebookPosts', []),
    }

def simple_page(api, key, fields):
    p = api.get(key, {})
    pc = p.get('pageContent', {})
    return {'pageContent': {k: resolve(pc.get(k, '')) for k in fields}}

out = {
    'navItems': api.get('navItems', []),
    'siteMeta': site_meta(api),
    'home': home_section(api),
    'about': about_section(api),
    'ourWork': ourwork_section(api),
    'impact': impact_section(api),
    'gallery': gallery_section(api),
    'getInvolved': getinvolved_section(api),
    'contact': contact_section(api),
    'thankYou': simple_page(api, 'thankYou', ['eyebrow', 'heading', 'body', 'buttonLabel']),
    'notFound': simple_page(api, 'notFound', ['eyebrow', 'heading', 'body', 'buttonLabel']),
}

with open('packages/web/src/content.js', 'w') as f:
    f.write('export const fallbackSiteContent = ')
    json.dump(out, f, indent=2, ensure_ascii=False)
    f.write('\n')
