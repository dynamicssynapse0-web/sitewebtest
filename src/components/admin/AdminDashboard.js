'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutButton from './LogoutButton';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { SUPABASE_MEDIA_BUCKET } from '@/lib/supabase/config';
import { buildUniqueUploadName, validateUploadFile } from '@/lib/upload';
import { compressImageForUpload } from '@/lib/imageCompression';
import {
  decodeMaybeJson,
  normalizeImages,
  slugify,
  toIsoDate,
} from '@/lib/supabase/records';
import { safeText } from '@/lib/supabase/serialization';
import { listeSports } from '@/lib/sports';
import {
  CATEGORY_DISCIPLINES,
  MAX_CATEGORY_IMAGES,
} from '@/lib/categoriesSport';
import {
  deleteArticle,
  deleteCategorySport,
  deleteImagesSport,
  deleteSportif,
  deleteVitrine,
  saveArticle,
  saveCategorySport,
  saveImagesSport,
  saveSportif,
  saveVitrine,
} from '@/app/admin/actions';

const sportOptions = listeSports.map(({ nom }) => ({ value: nom, label: nom }));
const categoryDisciplineOptions = CATEGORY_DISCIPLINES.map((discipline) => ({
  value: discipline,
  label: discipline,
}));

const SECTIONS = [
  {
    key: 'international',
    label: 'Compétitions internationales',
    hint: 'articles · type international',
    icon: '🌍',
    multiple: true,
    fields: [
      { name: 'title', label: 'Titre', placeholder: 'Cameroun vs Namibie', required: true },
      { name: 'competition', label: 'Compétition', placeholder: 'Qualifications CAN 2027' },
      { name: 'sport', label: 'Sport', type: 'select', options: sportOptions },
      { name: 'date', label: 'Date exacte', type: 'date' },
      { name: 'location', label: 'Lieu', placeholder: 'Stade de Japoma , Douala' },
      { name: 'excerpt', label: 'Résumé', type: 'textarea' },
      { name: 'content', label: 'Contenu détaillé', type: 'textarea' },
    ],
  },
  {
    key: 'event',
    label: 'Événements',
    hint: 'articles · type event',
    icon: '📅',
    multiple: true,
    fields: [
      { name: 'title', label: 'Titre', placeholder: 'MTN Elite 1 — 10e journée', required: true },
      { name: 'sport', label: 'Sport', type: 'select', options: sportOptions },
      { name: 'date', label: 'Date exacte', type: 'date' },
      { name: 'season', label: 'Saison', placeholder: '2026-2027' },
      { name: 'location', label: 'Lieu', placeholder: 'Stades de Douala' },
      { name: 'excerpt', label: 'Résumé', type: 'textarea' },
      { name: 'content', label: 'Contenu détaillé', type: 'textarea' },
    ],
  },
  {
    key: 'images_sport',
    label: 'Images Sport',
    hint: 'images_sport · disciplines photo',
    icon: '📸',
    multiple: true,
    fields: [
      { name: 'title', label: 'Titre', placeholder: 'BASKETBALL', required: true },
      {
        name: 'description',
        label: 'Description courte',
        type: 'textarea',
        placeholder: 'Ambiance des salles, dunks et tirs à 3 points.',
      },
      { name: 'ordre', label: 'Ordre d’affichage', type: 'number', placeholder: '1' },
    ],
  },
  {
    key: 'categories_sport',
    label: 'Catégories de sport',
    hint: 'categories_sport · menu Sport à 2 niveaux',
    icon: '🏅',
    multiple: true,
    fields: [
      {
        name: 'discipline',
        label: 'Discipline',
        type: 'select',
        options: categoryDisciplineOptions,
        required: true,
      },
      {
        name: 'sous_discipline',
        label: 'Sous-discipline',
        placeholder: 'MTN Elite One',
        required: true,
      },
      { name: 'ordre', label: 'Ordre d’affichage', type: 'number', placeholder: '1' },
    ],
  },
  {
    key: 'sportif',
    label: 'Sportifs de la semaine',
    hint: 'sportifs_semaine',
    icon: '🏆',
    multiple: true,
    fields: [
      { name: 'title', label: 'Titre', placeholder: 'Le talent en mouvement', required: true },
      { name: 'player_name', label: 'Nom du joueur', placeholder: 'TIMBA' },
      { name: 'position', label: 'Poste', placeholder: 'Attaquant' },
      { name: 'competition', label: 'Compétition', placeholder: 'MTN Elite 1' },
      { name: 'discipline', label: 'Discipline', placeholder: 'Football' },
      { name: 'quote', label: 'Citation', type: 'textarea' },
      { name: 'event_slug', label: 'Événement lié (slug)', placeholder: 'mtn-elite-one' },
      { name: 'cta', label: 'Texte du bouton', placeholder: 'Voir le portrait' },
      { name: 'featured', label: 'À la une', type: 'checkbox' },
    ],
  },
  {
    key: 'moment_fort',
    label: 'Les moments forts',
    hint: 'vitrine_items · moment_fort',
    icon: '⚡',
    multiple: true,
    fields: [
      { name: 'title', label: 'Titre / Légende', required: true },
      { name: 'ordre', label: 'Ordre d’affichage', type: 'number', placeholder: '1' },
    ],
  },
  {
    key: 'portrait_exclusif',
    label: 'Portrait exclusif',
    hint: 'vitrine_items · portrait_exclusif',
    icon: '📸',
    multiple: false,
    fields: [
      { name: 'title', label: 'Nom du joueur', required: true },
      { name: 'subtitle', label: 'Sous-titre / Poste', placeholder: 'Attaquant' },
      { name: 'ordre', label: 'Ordre d’affichage', type: 'number', placeholder: '1' },
    ],
  },
];

function emptyForm(section) {
  const form = {
    id: null,
    _images: [],
    _cover: null,
    _alt: '',
    cover_image: '',
  };
  section.fields.forEach((field) => {
    form[field.name] = field.type === 'checkbox' ? false : '';
  });
  return form;
}

function rowToForm(section, row) {
  const safeRow =
    row && typeof row === 'object' && !Array.isArray(row) ? row : {};
  const form = emptyForm(section);
  const hasCover = ['images_sport', 'categories_sport'].includes(section.key);
  const fallbackTitle =
    safeText(safeRow.title) ||
    safeText(safeRow.sous_discipline) ||
    'Photo';
  const cover = hasCover
    ? normalizeImages(
        decodeMaybeJson(
          safeRow.cover_image ?? safeRow.image ?? safeRow.image_url
        ),
        fallbackTitle
      )[0] || null
    : null;
  const images = hasCover
    ? normalizeImages(
        decodeMaybeJson(safeRow.images ?? safeRow.photos),
        fallbackTitle
      )
    : normalizeImages(
        decodeMaybeJson(safeRow.images ?? safeRow.image ?? safeRow.image_url),
        fallbackTitle
      );

  section.fields.forEach((field) => {
    const raw = safeRow[field.name];
    if (field.type === 'date') form[field.name] = toIsoDate(raw);
    else if (field.type === 'checkbox') {
      form[field.name] =
        raw === true ||
        ['true', '1', 'oui'].includes(String(raw ?? '').toLowerCase());
    } else if (field.type === 'number') form[field.name] = Number(raw) || 0;
    else if (raw !== null && typeof raw === 'object') {
      form[field.name] = JSON.stringify(raw);
    } else form[field.name] = raw ?? '';
  });

  return {
    ...form,
    id: safeRow.id ?? null,
    _images: images,
    _cover: cover,
    cover_image: cover?.src || '',
    _alt: (cover || images[0])?.alt || '',
  };
}

function existingKey(row) {
  return String(row?.id || row?.slug || row?.title || '');
}

function rowOptionKey(row) {
  return `row:${existingKey(row)}`;
}

function baseOptionKey(sport) {
  return `base:${sport.slug}`;
}

function existingOptions(section, items) {
  if (section.key === 'categories_sport') {
    return (items.categories_sport || []).map((row) => ({
      value: existingKey(row),
      label: `${safeText(row.discipline) || 'Sport'} — ${
        safeText(row.sous_discipline) || 'Sans titre'
      }`,
    }));
  }
  if (section.key !== 'images_sport') {
    return (items[section.key] || []).map((row) => ({
      value: existingKey(row),
      label: safeText(row.title) || 'Sans titre',
    }));
  }

  const published = items.images_sport || [];
  const publishedSlugs = new Set(
    published.map((row) => slugify(row.slug || row.title))
  );
  const publishedOptions = published.map((row) => ({
    value: rowOptionKey(row),
    label: `${safeText(row.title) || 'Sans titre'} · publié`,
  }));
  const baseOptions = listeSports
    .filter((sport) => !publishedSlugs.has(sport.slug))
    .map((sport) => ({ value: baseOptionKey(sport), label: sport.nom }));

  return [...publishedOptions, ...baseOptions];
}

function actionsFor(key) {
  if (key === 'images_sport') {
    return { save: saveImagesSport, remove: deleteImagesSport };
  }
  if (key === 'categories_sport') {
    return { save: saveCategorySport, remove: deleteCategorySport };
  }
  if (key === 'sportif') return { save: saveSportif, remove: deleteSportif };
  if (key === 'moment_fort' || key === 'portrait_exclusif') {
    return { save: saveVitrine, remove: deleteVitrine };
  }
  return { save: saveArticle, remove: deleteArticle };
}

function itemSubtitle(section, row) {
  if (section.key === 'images_sport') {
    const count = normalizeImages(decodeMaybeJson(row.images ?? row.photos)).length;
    return [safeText(row.description), count ? `${count} photo${count > 1 ? 's' : ''}` : '']
      .filter(Boolean)
      .join(' — ');
  }
  if (section.key === 'categories_sport') {
    const count = normalizeImages(decodeMaybeJson(row.images)).length;
    return [safeText(row.slug), count ? `${count} photo${count > 1 ? 's' : ''}` : '']
      .filter(Boolean)
      .join(' — ');
  }
  if (section.key === 'sportif') {
    return [row.player_name, row.position, row.competition]
      .map(safeText)
      .filter(Boolean)
      .join(' — ');
  }
  if (section.key === 'moment_fort' || section.key === 'portrait_exclusif') {
    const count = section.key === 'moment_fort'
      ? normalizeImages(decodeMaybeJson(row.images ?? row.image ?? row.image_url)).length
      : 0;
    return [
      safeText(row.subtitle),
      count ? `${count} photo${count > 1 ? 's' : ''}` : '',
      row.ordre ? `Ordre ${safeText(row.ordre)}` : '',
    ]
      .filter(Boolean)
      .join(' — ');
  }
  return [row.date, row.location].map(safeText).filter(Boolean).join(' · ');
}

function FieldInput({ field, value, onChange }) {
  const id = `admin-field-${field.name}`;
  const common = {
    id,
    name: field.name,
    value: value ?? '',
    onChange: (event) => onChange(field.name, event.target.value),
    placeholder: field.placeholder,
    required: field.required,
    className:
      'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200',
  };

  if (field.type === 'textarea') {
    return <textarea {...common} rows={4} />;
  }

  if (field.type === 'select') {
    return (
      <select {...common}>
        <option value="">— Choisir —</option>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label
        htmlFor={id}
        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-blue-950"
      >
        <input
          id={id}
          name={field.name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.name, event.target.checked)}
          className="h-5 w-5 accent-red-600"
        />
        {field.label}
      </label>
    );
  }

  return <input {...common} type={field.type || 'text'} />;
}

export default function AdminDashboard({ email, initial }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [activeKey, setActiveKey] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [selectedExisting, setSelectedExisting] = useState('');
  const [form, setForm] = useState({});
  const [newFiles, setNewFiles] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  // Libère l'URL temporaire de l'aperçu quand on change ou retire la couverture.
  useEffect(
    () => () => {
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview]
  );

  const activeSection = SECTIONS.find((section) => section.key === activeKey) || null;

  function openSection(section) {
    setActiveKey(section.key);
    setEditingId(null);
    setSelectedExisting('');
    setForm(emptyForm(section));
    setNewFiles([]);
    setCoverFile(null);
    setCoverPreview('');
    setNotice('');
    setError('');
  }

  function closeSection() {
    setActiveKey(null);
    setEditingId(null);
    setSelectedExisting('');
    setForm({});
    setNewFiles([]);
    setCoverFile(null);
    setCoverPreview('');
  }

  function editItem(section, row) {
    const nextForm = rowToForm(section, row);
    setActiveKey(section.key);
    setEditingId(row.id ?? null);
    setSelectedExisting(
      section.key === 'images_sport' ? rowOptionKey(row) : existingKey(row)
    );
    setForm(nextForm);
    setNewFiles([]);
    setCoverFile(null);
    setCoverPreview('');
    setNotice('Élément Supabase repris avec ses photos. Vous pouvez en ajouter.');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function applyExisting(event) {
    const key = event.target.value;
    setSelectedExisting(key);
    setError('');
    setCoverFile(null);
    setCoverPreview('');
    setNewFiles([]);

    if (!activeSection || !key) {
      setEditingId(null);
      setForm(emptyForm(activeSection || SECTIONS[0]));
      setNotice('');
      return;
    }

    if (activeSection.key === 'images_sport') {
      if (key.startsWith('row:')) {
        const row = (items.images_sport || []).find(
          (item) => rowOptionKey(item) === key
        );
        if (!row) return;
        setForm(rowToForm(activeSection, row));
        setEditingId(row.id ?? null);
        setNotice('Discipline Supabase reprise avec ses photos. Vous pouvez en ajouter.');
        return;
      }

      if (key.startsWith('base:')) {
        const sport = listeSports.find((item) => baseOptionKey(item) === key);
        if (!sport) return;
        setForm(
          rowToForm(activeSection, {
            title: sport.nom,
            description: sport.description,
            cover_image: sport.image,
            images: [],
            ordre: 0,
          })
        );
        setEditingId(null);
        setNotice('Discipline de base reprise. Ajoutez vos photos puis publiez.');
        return;
      }

      return;
    }

    const row = (items[activeSection.key] || []).find(
      (item) => existingKey(item) === key
    );
    if (!row) return;

    setForm(rowToForm(activeSection, row));
    setEditingId(row.id ?? null);
    setNotice('Élément Supabase repris avec ses photos. Vous pouvez en ajouter.');
  }

  function setField(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleFiles(event) {
    const accepted = [];
    const rejected = [];

    Array.from(event.target.files || []).forEach((file) => {
      const error = validateUploadFile(file, { stage: 'original' });
      if (error) rejected.push(`${file.name} : ${error}`);
      else accepted.push(file);
    });

    if (rejected.length > 0) setError(rejected.join(' '));
    else setError('');

    if (activeSection?.key === 'categories_sport') {
      const already = (form._images || []).length + newFiles.length;
      if (already + accepted.length > MAX_CATEGORY_IMAGES) {
        setError(
          `4 images secondaires maximum par catégorie (${already} déjà sélectionnée${
            already > 1 ? 's' : ''
          }). Retirez-en avant d’en ajouter.`
        );
        event.target.value = '';
        return;
      }
    }

    if (accepted.length > 0) {
      setNewFiles((previous) => [...previous, ...accepted]);
    }
    event.target.value = '';
  }

  function handleCoverFile(event) {
    const file = Array.from(event.target.files || [])[0] || null;
    if (!file) {
      setCoverFile(null);
      setCoverPreview('');
      setForm((previous) => ({
        ...previous,
        cover_image: previous._cover?.src || '',
      }));
      event.target.value = '';
      return;
    }

    const validationError = validateUploadFile(file, { stage: 'original' });
    if (validationError) {
      setError(validationError);
      setCoverFile(null);
      setCoverPreview('');
      setForm((previous) => ({
        ...previous,
        cover_image: previous._cover?.src || '',
      }));
    } else {
      setError('');
      setCoverFile(file);
      // Aperçu immédiat : l'image est sélectionnée mais pas encore uploadée.
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
      setForm((previous) => ({
        ...previous,
        cover_image: previous._cover?.src || previewUrl,
      }));
    }
    event.target.value = '';
  }

  function removeCover() {
    setForm((previous) => ({ ...previous, _cover: null, cover_image: '' }));
    setCoverFile(null);
    setCoverPreview('');
  }

  function removeExisting(index) {
    setForm((previous) => ({
      ...previous,
      _images: (previous._images || []).filter((_, position) => position !== index),
    }));
  }

  async function uploadFiles(section, title = form.title) {
    if (newFiles.length === 0) return [];

    const supabase = getBrowserSupabase();
    if (!supabase) throw new Error('Supabase n’est pas configuré.');

    const uploaded = [];
    let position = 0;
    const defaultAlt = `Aubin Simo - Bilderfassung ${title || ''}`.trim();
    const altText = String(form._alt || '').trim() || defaultAlt;

    for (const source of newFiles) {
      position += 1;
      const optimized = await compressImageForUpload(source);
      const fileName = buildUniqueUploadName({
        title: title || section.key,
        index: position,
        extension: optimized.extension,
        mimeType: optimized.blob.type,
      });
      const path = `${section.key}/${fileName}`;

      // Le fichier envoyé porte le bon type MIME (WebP/JPEG après compression).
      const file = new File([optimized.blob], fileName, {
        type: optimized.blob.type || source.type || 'image/jpeg',
      });

      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_MEDIA_BUCKET)
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(`Upload de ${source.name} : ${uploadError.message}`);
      }

      const { data } = supabase.storage
        .from(SUPABASE_MEDIA_BUCKET)
        .getPublicUrl(path);

      uploaded.push({
        src: data.publicUrl,
        alt: altText,
        legend: title || source.name,
        credit: 'Aubin Simo',
      });
    }

    return uploaded;
  }

  async function uploadCover(title, sectionKey) {
    if (!coverFile) return form._cover?.src || '';

    const supabase = getBrowserSupabase();
    if (!supabase) throw new Error('Supabase n’est pas configuré.');

    const optimized = await compressImageForUpload(coverFile);
    const fileName = buildUniqueUploadName({
      title: title || 'sport',
      index: 0,
      extension: optimized.extension,
      mimeType: optimized.blob.type,
      tag: 'cover',
    });
    const path = `${sectionKey}/${fileName}`;
    const file = new File([optimized.blob], fileName, {
      type: optimized.blob.type || coverFile.type || 'image/jpeg',
    });

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_MEDIA_BUCKET)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(`Upload de la couverture : ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(SUPABASE_MEDIA_BUCKET)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!activeSection) return;

    setBusy(true);
    setNotice('');
    setError('');

    try {
      const isImagesSport = activeSection.key === 'images_sport';
      const isCategorySport = activeSection.key === 'categories_sport';
      const hasCover = isImagesSport || isCategorySport;
      const uploadTitle = isCategorySport
        ? String(form.sous_discipline || '').trim()
        : form.title;

      if (isCategorySport) {
        if (!form.discipline) {
          throw new Error('Choisissez une discipline dans la liste.');
        }
        if (!uploadTitle) {
          throw new Error('La sous-discipline est obligatoire.');
        }
      }

      const uploaded = await uploadFiles(activeSection, uploadTitle);
      const allImages = [...(form._images || []), ...uploaded].slice(
        0,
        isCategorySport ? MAX_CATEGORY_IMAGES : activeSection.multiple ? 30 : 1
      );
      const coverImage = hasCover
        ? await uploadCover(uploadTitle, activeSection.key)
        : '';
      if (isCategorySport && !coverImage) {
        throw new Error('Une image de couverture est obligatoire.');
      }
      const { save } = actionsFor(activeSection.key);

      let payload;
      if (isImagesSport) {
        payload = {
          id: editingId,
          title: form.title,
          slug: slugify(form.title),
          description: form.description || '',
          cover_image: coverImage,
          images: JSON.stringify(allImages),
          ordre: Number(form.ordre) || 0,
        };
      } else if (isCategorySport) {
        payload = {
          id: editingId,
          discipline: form.discipline,
          sous_discipline: uploadTitle,
          slug: slugify(`${form.discipline}-${uploadTitle}`),
          cover_image: coverImage,
          images: JSON.stringify(allImages),
          ordre: Number(form.ordre) || 0,
        };
      } else if (activeSection.key === 'international' || activeSection.key === 'event') {
        payload = {
          id: editingId,
          type: activeSection.key,
          title: form.title,
          competition: form.competition || '',
          sport: form.sport || '',
          date: form.date || '',
          season: form.season || '',
          location: form.location || '',
          excerpt: form.excerpt || '',
          content: form.content || '',
          cover_image: allImages[0]?.src || '',
          images: JSON.stringify(allImages),
        };
      } else if (activeSection.key === 'sportif') {
        payload = {
          id: editingId,
          title: form.title,
          player_name: form.player_name || '',
          position: form.position || '',
          competition: form.competition || '',
          discipline: form.discipline || '',
          quote: form.quote || '',
          event_slug: form.event_slug || '',
          cta: form.cta || '',
          featured: Boolean(form.featured),
          images: JSON.stringify(allImages),
        };
      } else {
        payload = {
          id: editingId,
          section: activeSection.key,
          title: form.title,
          subtitle: form.subtitle || '',
          ordre: Number(form.ordre) || 0,
          image: allImages[0]?.src || '',
          image_url: allImages[0]?.src || '',
          alt:
            String(form._alt || '').trim() ||
            `Aubin Simo - Bilderfassung ${form.title || ''}`.trim(),
          images: JSON.stringify(allImages),
        };
      }

      const saved = await save(payload);

      if (!saved?.ok) {
        setError(saved?.error || 'Enregistrement impossible.');
        return;
      }

      const record = saved.data || {};
      setItems((previous) => {
        const list = previous[activeSection.key] || [];
        const exists = list.some((row) => row.id === record.id);
        return {
          ...previous,
          [activeSection.key]: exists
            ? list.map((row) => (row.id === record.id ? record : row))
            : [record, ...list],
        };
      });

      setNotice('Enregistrement effectué.');
      setEditingId(null);
      setSelectedExisting('');
      setForm(emptyForm(activeSection));
      setNewFiles([]);
      setCoverFile(null);
      setCoverPreview('');
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || 'Une erreur est survenue.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(section, row) {
    const label = row.title || row.sous_discipline || 'cet élément';
    if (!window.confirm(`Supprimer « ${label} » ?`)) return;

    setBusy(true);
    setNotice('');
    setError('');

    try {
      const { remove } = actionsFor(section.key);
      const result = await remove(row.id);

      if (!result?.ok) {
        setError(result?.error || 'Suppression impossible.');
        return;
      }

      setItems((previous) => ({
        ...previous,
        [section.key]: (previous[section.key] || []).filter(
          (item) => item.id !== row.id
        ),
      }));
      setNotice('Élément supprimé.');
      setSelectedExisting('');
      router.refresh();
    } catch (deleteError) {
      setError(deleteError.message || 'Suppression impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <header className="bg-blue-950 px-4 py-7 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
              Bilderfassung · Espace privé
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              Administration
            </h1>
            {email ? <p className="mt-1 text-sm text-blue-100/70">{email}</p> : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:border-red-400 hover:bg-red-600"
            >
              Voir le site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        {notice ? (
          <p
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800"
          >
            {notice}
          </p>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
          >
            {error}
          </p>
        ) : null}

        {!activeSection ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-blue-950">
                Que souhaitez-vous gérer ?
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Choisissez une rubrique pour ajouter, modifier ou supprimer un contenu.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => openSection(section)}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-400 hover:shadow-lg"
                >
                  <span className="text-3xl" aria-hidden="true">
                    {section.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-base font-extrabold text-blue-950">
                      {section.label}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {(items[section.key] || []).length} élément(s) · {section.hint}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-xl text-red-600">
                    →
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={closeSection}
              className="mb-5 text-sm font-bold text-blue-900 transition hover:text-red-600"
            >
              ← Toutes les rubriques
            </button>

            <div className="mb-7 flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {activeSection.icon}
              </span>
              <div>
                <h2 className="text-2xl font-extrabold text-blue-950">
                  {activeSection.label}
                </h2>
                <p className="text-xs text-gray-500">{activeSection.hint}</p>
              </div>
            </div>

            <section className="mb-9 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-gray-500">
                Éléments publiés ({(items[activeSection.key] || []).length})
              </h3>
              {(items[activeSection.key] || []).length === 0 ? (
                <p className="text-sm text-gray-500">Aucun élément pour le moment.</p>
              ) : (
                <ul className="space-y-3">
                  {(items[activeSection.key] || []).map((row) => (
                    <li
                      key={row.id || row.slug || row.title}
                      className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="break-words font-bold text-blue-950">
                          {activeSection.key === 'categories_sport'
                            ? `${safeText(row.discipline) || 'Sport'} — ${
                                safeText(row.sous_discipline) || 'Sans titre'
                              }`
                            : safeText(row.title) || 'Sans titre'}
                        </p>
                        <p className="mt-1 break-words text-xs text-gray-500">
                          {itemSubtitle(activeSection, row)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => editItem(activeSection, row)}
                          className="rounded-full bg-blue-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-800"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(activeSection, row)}
                          disabled={busy}
                          className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <h3 className="mb-5 text-lg font-extrabold text-blue-950">
                {editingId ? 'Modifier l’élément' : 'Nouvel élément'}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="admin-existing-item"
                    className="mb-2 block text-sm font-bold text-blue-950"
                  >
                    {activeSection.key === 'images_sport'
                      ? 'Choisir une discipline existante (Supabase ou sports de base)…'
                      : activeSection.key === 'categories_sport'
                        ? 'Choisir une catégorie existante à modifier…'
                        : ['moment_fort', 'portrait_exclusif'].includes(activeSection.key)
                          ? 'Choisir un élément existant pour le modifier ou ajouter une photo…'
                          : 'Choisir un élément existant pour lui ajouter des photos…'}
                  </label>
                  <select
                    id="admin-existing-item"
                    value={selectedExisting}
                    onChange={applyExisting}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  >
                    <option value="">+ Créer un nouveau titre</option>
                    {existingOptions(activeSection, items).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {activeSection.key === 'images_sport'
                      ? 'Les disciplines publiées et les sports de base sont proposés. La sélection pré-remplit le titre, la couverture, les photos et la description.'
                      : activeSection.key === 'categories_sport'
                        ? 'La sélection pré-remplit la discipline, la couverture et les 4 photos maximum.'
                        : 'Tous les titres et leurs photos proviennent de Supabase. La sélection pré-remplit le formulaire pour ajouter des photos ou modifier l’élément.'}
                  </p>
                </div>
                {activeSection.fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.type === 'textarea' || field.type === 'checkbox'
                        ? 'sm:col-span-2'
                        : ''
                    }
                  >
                    {field.type !== 'checkbox' ? (
                      <label
                        htmlFor={`admin-field-${field.name}`}
                        className="mb-2 block text-sm font-bold text-blue-950"
                      >
                        {field.label}
                      </label>
                    ) : null}
                    <FieldInput
                      field={field}
                      value={form[field.name]}
                      onChange={setField}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                {['images_sport', 'categories_sport'].includes(activeSection.key) ? (
                  <>
                    <label
                      htmlFor="admin-cover"
                      className="mb-2 block text-sm font-bold text-blue-950"
                    >
                      {activeSection.key === 'categories_sport'
                        ? 'Image de couverture (obligatoire)'
                        : 'Image principale (couverture)'}
                    </label>
                    <input
                      id="admin-cover"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      required={
                        activeSection.key === 'categories_sport' &&
                        !form.cover_image &&
                        !coverFile
                      }
                      onChange={handleCoverFile}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-900 file:px-5 file:py-3 file:text-sm file:font-bold file:text-white hover:file:bg-red-600"
                    />
                    {coverPreview || form._cover?.src ? (
                      <div className="mt-3 flex items-center gap-3">
                        <Image
                          src={coverPreview || form._cover.src}
                          alt={form._cover?.alt || 'Couverture sélectionnée'}
                          width={80}
                          height={80}
                          unoptimized={Boolean(coverPreview)}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-blue-950">
                            {coverPreview
                              ? 'Image sélectionnée'
                              : 'Couverture actuelle'}
                          </p>
                          {coverFile ? (
                            <p className="mt-1 break-words text-xs text-gray-600">
                              {coverFile.name} — sera uploadée à l’enregistrement.
                            </p>
                          ) : null}
                          <button
                            type="button"
                            onClick={removeCover}
                            className="mt-1 text-xs font-bold text-red-600"
                          >
                            Retirer la couverture
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <label
                      htmlFor="admin-images"
                      className="mb-2 mt-6 block text-sm font-bold text-blue-950"
                    >
                      {activeSection.key === 'categories_sport'
                        ? `Autres images (4 maximum — ${
                            (form._images || []).length + newFiles.length
                          }/4)`
                        : 'Images secondaires (plusieurs possibles)'}
                    </label>
                    <input
                      id="admin-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      multiple
                      onChange={handleFiles}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-900 file:px-5 file:py-3 file:text-sm file:font-bold file:text-white hover:file:bg-red-600"
                    />
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="admin-images"
                      className="mb-2 block text-sm font-bold text-blue-950"
                    >
                      {activeSection.multiple
                        ? 'Photos (plusieurs possibles)'
                        : 'Photo'}
                    </label>
                    <input
                      id="admin-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      multiple={activeSection.multiple}
                      onChange={handleFiles}
                      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-900 file:px-5 file:py-3 file:text-sm file:font-bold file:text-white hover:file:bg-red-600"
                    />
                  </>
                )}

                <div className="mt-4">
                  <label
                    htmlFor="admin-photo-alt"
                    className="mb-2 block text-sm font-bold text-blue-950"
                  >
                    Texte alternatif (alt)
                  </label>
                  <input
                    id="admin-photo-alt"
                    type="text"
                    value={form._alt || ''}
                    onChange={(event) => setField('_alt', event.target.value)}
                    placeholder={`Aubin Simo - Bilderfassung ${form.title || ''}`.trim()}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Laissez vide pour utiliser « Aubin Simo - Bilderfassung » suivi du titre.
                  </p>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Formats acceptés : JPG, PNG et WebP (15 Mo maximum avant compression,
                  3 Mo après). Upload direct dans le bucket Supabase «{' '}
                  {SUPABASE_MEDIA_BUCKET} ». Fichiers renommés en « aubin-simo-bilderfassung-… »,
                  redimensionnés à 1600 px max et compressés en WebP/JPEG (qualité 0,82).
                  Crédit : Aubin Simo.
                </p>

                {form._images?.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {form._images.map((image, index) => (
                      <div key={image.src || index} className="relative">
                        <Image
                          src={image.src}
                          alt={image.alt || 'Photo'}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExisting(index)}
                          aria-label={`Retirer la photo ${index + 1}`}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {newFiles.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-xs text-gray-600">
                    {newFiles.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="break-words">
                        · {file.name} (à uploader)
                        <button
                          type="button"
                          onClick={() =>
                            setNewFiles((previous) =>
                              previous.filter((_, position) => position !== index)
                            )
                          }
                          className="ml-2 font-bold text-red-600"
                        >
                          retirer
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="mt-7 w-full rounded-full bg-red-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {busy
                  ? 'Enregistrement…'
                  : editingId
                    ? 'Enregistrer les modifications'
                    : 'Publier'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
