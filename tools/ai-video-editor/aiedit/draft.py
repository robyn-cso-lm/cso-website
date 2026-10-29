"""Write a CapCut draft (schema 167, CapCut 8.x) from an edit plan.

The shapes below were copied from a real draft saved by CapCut 8.5 on Windows.
Everything stays editable in CapCut: cuts are separate clips, every caption is a
real text layer, B-roll sits on its own track.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
import uuid
from pathlib import Path

from . import fonts
from .config import capcut_drafts_dir
from .cuts import Timeline

US = 1_000_000


def uid():
    return str(uuid.uuid4()).upper()


def us(seconds):
    return int(round(seconds * US))


def hex_rgb(h):
    h = h.lstrip("#")
    return [round(int(h[i:i + 2], 16) / 255, 4) for i in (0, 2, 4)]


# ---------------------------------------------------------------- materials

def _speed():
    return {"curve_speed": None, "id": uid(), "mode": 0, "speed": 1.0, "type": "speed"}


def _placeholder():
    return {"error_path": "", "error_text": "", "id": uid(), "meta_type": "none", "res_path": "", "res_text": "", "type": "placeholder_info"}


def _canvas():
    return {"album_image": "", "blur": 0.0, "color": "", "id": uid(), "image": "", "image_id": "", "image_name": "",
            "source_platform": 0, "team_id": "", "type": "canvas_color"}


def _anim():
    return {"animations": [], "id": uid(), "multi_language_current": "none", "type": "sticker_animation"}


def _channel():
    return {"audio_channel_mapping": 0, "id": uid(), "is_config_open": False, "type": ""}


def _color():
    return {"gradient_angle": 90.0, "gradient_colors": [], "gradient_percents": [], "height": 0.0, "id": uid(),
            "is_color_clip": False, "solid_color": "", "width": 0.0}


def _vocal():
    return {"choice": 0, "enter_from": "", "final_algorithm": "", "id": uid(), "production_path": "",
            "removed_sounds": [], "time_range": None, "type": "vocal_separation"}


def video_material(info, name=None):
    return {
        "aigc_history_id": "", "aigc_item_id": "", "aigc_type": "none", "audio_fade": None,
        "beauty_body_auto_preset": None, "beauty_body_preset_id": "",
        "beauty_face_auto_preset": {"name": "", "preset_id": "", "rate_map": "", "scene": ""},
        "beauty_face_auto_preset_infos": [], "beauty_face_preset_infos": [],
        "cartoon_path": "", "category_id": "", "category_name": "local", "check_flag": 62978047,
        "content_feature_info": None, "corner_pin": None,
        "crop": {"lower_left_x": 0.0, "lower_left_y": 1.0, "lower_right_x": 1.0, "lower_right_y": 1.0,
                 "upper_left_x": 0.0, "upper_left_y": 0.0, "upper_right_x": 1.0, "upper_right_y": 0.0},
        "crop_ratio": "free", "crop_scale": 1.0, "duration": us(info["duration"]), "extra_type_option": 0,
        "formula_id": "", "freeze": None, "has_audio": bool(info.get("has_audio", True)),
        "has_sound_separated": False, "height": int(info["height"]), "id": uid(),
        "intensifies_audio_path": "", "intensifies_path": "", "is_ai_generate_content": False, "is_copyright": False,
        "is_text_edit_overdub": False, "is_unified_beauty_mode": False, "live_photo_cover_path": "",
        "live_photo_timestamp": -1, "local_id": "", "local_material_from": "", "local_material_id": "",
        "material_id": "", "material_name": name or Path(info["path"]).name, "material_url": "", "matting": {
            "custom_matting_id": "", "enable_matting_stroke": False, "expansion": 0, "feather": 0, "flag": 0,
            "has_use_quick_brush": False, "has_use_quick_eraser": False, "interactiveTime": [], "path": "",
            "reverse": False, "strokes": []},
        "media_path": "", "multi_camera_info": None, "object_locked": None, "origin_material_id": "",
        "path": str(info["path"]).replace("\\", "/"), "picture_from": "none", "picture_set_category_id": "",
        "picture_set_category_name": "", "request_id": "", "reverse_intensifies_path": "", "reverse_path": "",
        "smart_match_info": None, "smart_motion": None, "source": 0, "source_platform": 0,
        "stable": {"matrix_path": "", "stable_level": 0, "time_range": {"duration": 0, "start": 0}},
        "surface_trackings": [], "team_id": "", "type": "video", "unique_id": "",
        "video_algorithm": {
            "ai_background_configs": [], "ai_expression_driven": None, "ai_in_painting_config": [],
            "ai_motion_driven": None, "aigc_generate": None, "aigc_generate_list": [], "algorithms": [],
            "complement_frame_config": None, "deflicker": None, "gameplay_configs": [], "image_interpretation": None,
            "motion_blur_config": None, "mouth_shape_driver": None, "noise_reduction": None, "path": "",
            "quality_enhance": None, "skip_algorithm_index": [], "smart_complement_frame": None,
            "story_video_modify_video_config": {"is_overwrite_last_video": False, "task_id": "", "tracker_task_id": ""},
            "super_resolution": None, "time_range": None},
        "video_mask_shadow": {"alpha": 0.0, "angle": 0.0, "blur": 0.0, "color": "", "distance": 0.0, "path": "", "resource_id": ""},
        "video_mask_stroke": {"alpha": 0.0, "color": "", "distance": 0.0, "horizontal_shift": 0.0, "path": "",
                              "resource_id": "", "size": 0.0, "texture": 0.0, "type": "", "vertical_shift": 0.0},
        "width": int(info["width"]),
    }


def _segment_base(material_id, src, dst, refs, volume=1.0, render_index=0, track_render_index=0, clip=True):
    return {
        "caption_info": None, "cartoon": False,
        "clip": {"alpha": 1.0, "flip": {"horizontal": False, "vertical": False}, "rotation": 0.0,
                 "scale": {"x": 1.0, "y": 1.0}, "transform": {"x": 0.0, "y": 0.0}} if clip else None,
        "color_correct_alg_result": "", "common_keyframes": [], "desc": "", "digital_human_template_group_id": "",
        "enable_adjust": True, "enable_adjust_mask": False, "enable_color_adjust_pro": False,
        "enable_color_correct_adjust": False, "enable_color_curves": True, "enable_color_match_adjust": False,
        "enable_color_wheels": True, "enable_hsl": False, "enable_hsl_curves": True, "enable_lut": True,
        "enable_mask_shadow": False, "enable_mask_stroke": False, "enable_smart_color_adjust": False,
        "enable_video_mask": True, "extra_material_refs": refs, "group_id": "",
        "hdr_settings": {"intensity": 1.0, "mode": 1, "nits": 1000} if clip else None,
        "id": uid(), "intensifies_audio": False, "is_loop": False, "is_placeholder": False, "is_tone_modify": False,
        "keyframe_refs": [], "last_nonzero_volume": 1.0, "lyric_keyframes": None, "material_id": material_id,
        "raw_segment_id": "", "render_index": render_index, "render_timerange": {"duration": 0, "start": 0},
        "responsive_layout": {"enable": False, "horizontal_pos_layout": 0, "size_layout": 0, "target_follow": "",
                              "vertical_pos_layout": 0},
        "reverse": False, "source": "segmentsourcenormal",
        "source_timerange": {"duration": us(src[1] - src[0]) if src else 0, "start": us(src[0]) if src else 0},
        "speed": 1.0, "state": 0,
        "target_timerange": {"duration": us(dst[1] - dst[0]), "start": us(dst[0])},
        "template_id": "", "template_scene": "default", "track_attribute": 0,
        "track_render_index": track_render_index, "uniform_scale": {"on": True, "value": 1.0},
        "visible": True, "volume": volume,
    }


def _text_material(content_json, kind, template_part, font_path, box, wrap):
    m = {
        "id": uid(), "type": kind, "content": content_json, "typesetting": 0, "alignment": 1,
        "letter_spacing": 0.0, "line_spacing": 0.02, "line_feed": 1, "line_max_width": wrap,
        "force_apply_line_max_width": False, "check_flag": 7, "global_alpha": 1.0, "font_path": font_path,
        "font_size": template_part["size"], "text_color": template_part["color"], "text_alpha": 1.0,
        "bold_width": 0.0, "italic_degree": 0, "underline": False, "has_shadow": False, "fonts": [],
        "is_rich_text": False, "add_type": 0,
    }
    if box:
        m.update({"background_color": box["color"], "background_alpha": box.get("alpha", 1.0), "background_style": 1,
                  "background_round_radius": 0.12, "background_width": 0.14, "background_height": 0.14,
                  "background_horizontal_offset": 0.0, "background_vertical_offset": 0.0, "background_fill": box["color"]})
    return m


def _text_content(words, part, font_path, upper):
    """words: list of (text, emphasised). Colours emphasised words with the highlight."""
    styles, text, pos = [], "", 0
    for i, (t, emph) in enumerate(words):
        piece = (t.upper() if upper else t) + (" " if i < len(words) - 1 else "")
        color = part["highlight"] if emph else part["color"]
        style = {
            "fill": {"alpha": 1.0, "content": {"render_type": "solid", "solid": {"alpha": 1.0, "color": hex_rgb(color)}}},
            "range": [pos, pos + len(piece)], "size": part["size"], "bold": False, "italic": bool(part.get("italic")),
            "underline": False, "useLetterColor": True,
            "font": {"id": "", "path": font_path},
        }
        if part.get("stroke_width", 0) > 0:
            style["strokes"] = [{"content": {"render_type": "solid", "solid": {"alpha": 1.0, "color": hex_rgb(part["stroke"])}},
                                 "width": part["stroke_width"]}]
        styles.append(style)
        text += piece
        pos += len(piece)
    return json.dumps({"styles": styles, "text": text}, ensure_ascii=False)


def _pop_keyframes(start_scale=0.82, dur=0.14):
    kfs = []
    for prop in ("KFTypeScaleX", "KFTypeScaleY"):
        kfs.append({
            "id": uid(), "material_id": "", "property_type": prop,
            "keyframe_list": [
                {"curveType": "Line", "graphID": "", "id": uid(), "left_control": {"x": 0.0, "y": 0.0},
                 "right_control": {"x": 0.0, "y": 0.0}, "time_offset": 0, "values": [start_scale]},
                {"curveType": "Line", "graphID": "", "id": uid(), "left_control": {"x": 0.0, "y": 0.0},
                 "right_control": {"x": 0.0, "y": 0.0}, "time_offset": us(dur), "values": [1.0]},
            ],
        })
    return kfs


# ---------------------------------------------------------------- the draft

def place_broll(total, clips, start_after=3.0, interval=6.0, length=3.0):
    """Evenly drop B-roll over the edit. Returns [(clip, timeline_start, timeline_end, src_start)]."""
    out = []
    if not clips:
        return out
    t, i = start_after, 0
    while t + 1.0 < total - 0.5:
        clip = clips[i % len(clips)]
        d = min(length, clip["duration"], total - 0.3 - t)
        if d >= 1.0:
            out.append((clip, t, t + d, 0.0))
        t += interval
        i += 1
    return out


def build_draft_json(plan, template, name):
    src = plan["source"]
    timeline = Timeline([tuple(r) for r in plan["keep"]])
    total = timeline.total
    cap, hook = template["caption"], template["hook"]
    cap_font = fonts.resolve(cap["font"])
    hook_font = fonts.resolve(hook["font"])

    materials = {k: [] for k in (
        "videos", "speeds", "placeholder_infos", "canvases", "material_animations", "sound_channel_mappings",
        "material_colors", "vocal_separations", "texts")}
    # every other list CapCut writes is present but empty
    for k in ("ai_translates", "audio_balances", "audio_effects", "audio_fades", "audio_pannings", "audio_pitch_shifts",
              "audio_track_indexes", "audios", "beats", "chromas", "color_curves", "common_mask", "drafts", "effects",
              "flowers", "green_screens", "placeholders", "handwrites", "hsl", "hsl_curves", "images", "log_color_wheels", "loudnesses",
              "manual_beautys", "manual_deformations", "multi_language_refs", "plugin_effects", "primary_color_wheels",
              "realtime_denoises", "shapes", "smart_crops", "smart_relights", "stickers", "tail_leaders", "text_templates",
              "time_marks", "transitions", "video_effects", "video_radius", "video_shadows", "video_strokes",
              "video_trackings", "vocal_beautifys", "digital_human_model_dressing", "digital_humans"):
        materials[k] = []

    def side_refs():
        parts = [(_speed(), "speeds"), (_placeholder(), "placeholder_infos"), (_canvas(), "canvases"), (_anim(), "material_animations"),
                 (_channel(), "sound_channel_mappings"), (_color(), "material_colors"), (_vocal(), "vocal_separations")]
        ids = []
        for obj, key in parts:
            materials[key].append(obj)
            ids.append(obj["id"])
        return ids

    main_mat = video_material(src)
    materials["videos"].append(main_mat)

    # main track: one clip per kept range
    main_segs = []
    for (s, e), off in zip(timeline.ranges, timeline.offsets):
        main_segs.append(_segment_base(main_mat["id"], (s, e), (off, off + (e - s)), side_refs()))
    tracks = [{"attribute": 0, "flag": 0, "id": uid(), "is_default_name": True, "name": "", "segments": main_segs, "type": "video"}]

    # b-roll track
    broll = place_broll(total, plan.get("broll", []))
    if broll:
        mats, segs = {}, []
        for clip, ts, te, ss in broll:
            if clip["path"] not in mats:
                mats[clip["path"]] = video_material(clip)
                materials["videos"].append(mats[clip["path"]])
            seg = _segment_base(mats[clip["path"]]["id"], (ss, ss + (te - ts)), (ts, te), side_refs(),
                                volume=0.0, render_index=1, track_render_index=1)
            segs.append(seg)
        tracks.append({"attribute": 0, "flag": 0, "id": uid(), "is_default_name": True, "name": "", "segments": segs, "type": "video"})

    # hook
    text_segs_hook, text_segs_cap = [], []
    hook_text = (plan.get("hook") or {}).get("text", "").strip()
    if hook_text and total > 0:
        words = [(w, False) for w in hook_text.split()]
        content = _text_content(words, hook, hook_font, hook.get("uppercase"))
        mat = _text_material(content, "text", hook, hook_font, hook.get("box"), hook.get("line_width", 0.8))
        materials["texts"].append(mat)
        dur = min(hook["seconds"], total)
        seg = _segment_base(mat["id"], None, (0, dur), _anim_ref(materials),
                            render_index=15001, track_render_index=3)
        seg["clip"]["transform"]["y"] = hook["y"]
        seg["common_keyframes"] = _pop_keyframes(0.8, 0.18)
        text_segs_hook.append(seg)

    # captions
    for c in plan.get("captions", []):
        words = [(w["text"], w["emph"]) for w in c["words"]]
        if not words:
            continue
        content = _text_content(words, cap, cap_font, cap.get("uppercase"))
        mat = _text_material(content, "subtitle", cap, cap_font, cap.get("box"), 0.82)
        materials["texts"].append(mat)
        seg = _segment_base(mat["id"], None, (c["start"], c["end"]), _anim_ref(materials),
                            render_index=14000, track_render_index=2)
        seg["clip"]["transform"]["y"] = cap["y"]
        if cap.get("pop"):
            seg["common_keyframes"] = _pop_keyframes(0.86, 0.1)
        text_segs_cap.append(seg)

    for segs in (text_segs_cap, text_segs_hook):
        if segs:
            tracks.append({"attribute": 0, "flag": 0, "id": uid(), "is_default_name": True, "name": "", "segments": segs, "type": "text"})

    plat = {"app_id": 359289, "app_source": "cc", "app_version": "8.5.0", "device_id": "", "hard_disk_id": "",
            "mac_address": "", "os": "windows" if sys.platform == "win32" else "mac", "os_version": ""}
    return {
        "canvas_config": {"background": None, "height": int(src["height"]), "ratio": "original", "width": int(src["width"])},
        "color_space": 0,
        "config": {"adjust_max_index": 1, "attachment_info": [], "combination_max_index": 1, "export_range": None,
                   "extract_audio_last_index": 1, "lyrics_recognition_id": "", "lyrics_sync": True, "lyrics_taskinfo": [],
                   "maintrack_adsorb": True, "material_save_mode": 0, "multi_language_current": "none",
                   "multi_language_list": [], "multi_language_main": "none", "multi_language_mode": "none",
                   "original_sound_last_index": 1, "record_audio_last_index": 1, "sticker_max_index": 1,
                   "subtitle_keywords_config": None, "subtitle_recognition_id": "", "subtitle_sync": True,
                   "subtitle_taskinfo": [], "system_font_list": [], "use_float_render": False, "video_mute": False,
                   "voice_change_sync": False, "zoom_info_params": None},
        "cover": None, "create_time": 0, "draft_type": "video", "duration": us(total), "extra_info": None, "fps": 30.0,
        "free_render_index_mode_on": False, "group_container": None, "id": uid(), "is_drop_frame_timecode": False,
        "keyframe_graph_list": [], "keyframes": {"adjusts": [], "audios": [], "effects": [], "filters": [], "handwrites": [],
                                                  "stickers": [], "texts": [], "videos": []},
        "last_modified_platform": plat, "lyrics_effects": [], "materials": materials, "mutable_config": None, "name": name,
        "new_version": "167.0.0", "path": "", "platform": plat, "relationships": [], "render_index_track_mode_on": False,
        "retouch_cover": None, "smart_ads_info": {"draft_url": "", "page_from": "", "routine": ""}, "source": "default",
        "static_cover_image_path": "", "time_marks": None, "tracks": tracks, "uneven_animation_template_info": None,
        "update_time": 0, "version": 360000,
        "function_assistant_info": {"audio_noise_segid_list": [], "auto_adjust": False, "auto_adjust_fixed": False,
                                    "auto_adjust_fixed_value": 50.0, "auto_adjust_segid_list": [], "auto_caption": False,
                                    "auto_caption_segid_list": [], "auto_caption_template_id": "", "caption_opt": False,
                                    "caption_opt_segid_list": [], "color_correction": False, "color_correction_fixed": False,
                                    "color_correction_fixed_value": 50.0, "color_correction_segid_list": [],
                                    "deflicker_segid_list": [], "enhance_quality": False, "enhance_quality_fixed": False,
                                    "enhance_quality_segid_list": [], "enhance_voice_segid_list": [], "enhande_voice": False,
                                    "enhande_voice_fixed": False},
    }


def _anim_ref(materials):
    a = _anim()
    materials["material_animations"].append(a)
    return [a["id"]]


# ---------------------------------------------------------------- writing

def _capcut_running():
    try:
        if sys.platform == "win32":
            out = subprocess.run(["tasklist", "/FI", "IMAGENAME eq CapCut.exe"], capture_output=True, text=True).stdout
            return "CapCut.exe" in out
        out = subprocess.run(["pgrep", "-x", "CapCut"], capture_output=True, text=True).stdout
        return bool(out.strip())
    except Exception:
        return False


def write_draft(plan, template, drafts_dir=None, name=None, register=True):
    drafts_dir = Path(drafts_dir) if drafts_dir else capcut_drafts_dir()
    name = name or plan.get("name") or Path(plan["source"]["path"]).stem
    folder = drafts_dir / name
    n = 2
    while folder.exists():
        folder = drafts_dir / f"{name} ({n})"
        n += 1
    folder.mkdir(parents=True)
    content = build_draft_json(plan, template, folder.name)
    (folder / "draft_content.json").write_text(json.dumps(content, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    now = int(time.time())
    total_us = content["duration"]
    meta = {
        "draft_cover": "draft_cover.jpg", "draft_fold_path": str(folder).replace("\\", "/"), "draft_id": uid(),
        "draft_name": folder.name, "draft_root_path": str(drafts_dir), "draft_is_invisible": False,
        "draft_materials": [{"type": 0, "value": [{
            "create_time": now, "duration": us(plan["source"]["duration"]), "enter_from": 0, "extra_info": Path(plan["source"]["path"]).name,
            "file_Path": str(plan["source"]["path"]).replace("\\", "/"), "height": int(plan["source"]["height"]), "id": str(uuid.uuid4()),
            "import_time": now, "import_time_ms": now * US, "item_source": 1, "md5": "", "metetype": "video",
            "roughcut_time_range": {"duration": us(plan["source"]["duration"]), "start": 0},
            "sub_time_range": {"duration": -1, "start": -1}, "type": 0, "width": int(plan["source"]["width"])}]}],
        "tm_draft_create": now * US, "tm_draft_modified": now * US, "tm_duration": total_us,
    }
    (folder / "draft_meta_info.json").write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")
    (folder / "draft_settings").write_text(
        f"[General]\ndraft_create_time={now}\ndraft_last_edit_time={now}\nreal_edit_seconds=0\nreal_edit_keys=0\n", encoding="utf-8")

    registered = False
    if register:
        registered = _register(drafts_dir, folder, meta)
    return folder, registered


def _register(drafts_dir, folder, meta):
    """Add the draft to CapCut's project list. Skipped (safely) if CapCut is open."""
    root = drafts_dir / "root_meta_info.json"
    if not root.exists() or _capcut_running():
        return False
    try:
        data = json.loads(root.read_text(encoding="utf-8"))
        shutil.copy2(root, root.with_suffix(".json.bak"))
        entry = {
            "draft_cover": str(folder / "draft_cover.jpg").replace("\\", "/"),
            "draft_fold_path": str(folder).replace("\\", "/"), "draft_id": meta["draft_id"],
            "draft_is_invisible": False, "draft_json_file": str(folder / "draft_content.json").replace("\\", "/"),
            "draft_name": folder.name, "draft_root_path": str(drafts_dir), "draft_timeline_materials_size": 0,
            "draft_type": "", "streaming_edit_draft_ready": True, "tm_draft_create": meta["tm_draft_create"],
            "tm_draft_modified": meta["tm_draft_modified"], "tm_draft_removed": 0, "tm_duration": meta["tm_duration"],
        }
        data.setdefault("all_draft_store", []).insert(0, entry)
        data["draft_ids"] = len(data["all_draft_store"])
        root.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        return True
    except Exception:
        return False


def validate(content):
    """Cheap structural check. Returns a list of problems (empty means fine)."""
    problems = []
    mats = content["materials"]
    ids = {m["id"] for lst in mats.values() for m in lst}
    for tr in content["tracks"]:
        last_end = 0
        for seg in tr["segments"]:
            if seg["material_id"] not in ids:
                problems.append(f"segment points at missing material {seg['material_id']}")
            for r in seg["extra_material_refs"]:
                if r not in ids:
                    problems.append(f"segment points at missing ref {r}")
            t = seg["target_timerange"]
            if t["start"] < last_end:
                problems.append(f"overlap on {tr['type']} track at {t['start']}")
            last_end = t["start"] + t["duration"]
            if last_end > content["duration"] + 1:
                problems.append(f"{tr['type']} segment runs past the end of the draft")
    return problems
