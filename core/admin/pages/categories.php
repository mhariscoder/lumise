<?php

$title  = 'Categories list';
$prefix = 'categories_';

// Search Form
$type        = isset($_GET['type']) ? sanitize_text_field(wp_unslash($_GET['type'])) : 'cliparts';
$data_search = '';
if (isset($_POST['search_cate']) && !empty($_POST['search_cate'])) {

    $data_search = isset($_POST['search']) ? trim(sanitize_text_field(wp_unslash($_POST['search']))) : null;

    if (empty($data_search)) {
        $errors = esc_html__('Please Insert Key Word', 'lumise');
    }

    LW()->session->set($prefix . $type . 'data_search', $data_search);
}

if (!empty(LW()->session->get($prefix . $type . 'data_search', null))) {
    $data_search = '%' . LW()->session->get($prefix . $type . 'data_search') . '%';
}

// Action Form
if (isset($_POST['action_submit']) && !empty($_POST['action_submit'])) {

    $data_action = isset($_POST['action']) ? sanitize_text_field(wp_unslash($_POST['action'])) : '';
    $val         = isset($_POST['id_action']) ? sanitize_text_field(wp_unslash($_POST['id_action'])) : '';
    $val         = explode(',', $val);

    $lumise_admin->check_caps('categories');

    foreach ($val as $value) {

        switch ($data_action) {

            case 'active':
                $data = array(
                    'active' => 1,
                );
                $dt   = $lumise_admin->edit_row($value, $data, 'categories');
                break;
            case 'deactive':
                $data = array(
                    'active' => 0,
                );
                $dt   = $lumise_admin->edit_row($value, $data, 'categories');
                break;
            case 'delete':
                $dt             = $lumise_admin->get_row_id($value, 'categories');
                $arr            = array('id', 'parent');
                $dts            = $lumise_admin->get_rows_custom($arr, 'categories');
                $arr            = array('id', 'category_id');
                $cate_reference = $lumise_admin->get_rows_custom($arr, 'categories_reference', $orderby = 'id', $order = 'asc');

                foreach ($cate_reference as $vals) {
                    if ($vals['category_id'] == $value) {
                        $lumise_admin->delete_row($vals['id'], 'categories_reference');
                    }
                }

                foreach ($dts as $val) {

                    if ($val['parent'] == $dt['id']) {
                        $val['parent'] = $dt['parent'];
                        $lumise_admin->edit_row($val['id'], $val, 'categories');
                    }
                }

                $tar_file = realpath($lumise->cfg->upload_path) . DS;
                if (!empty($dt['upload'])) {
                    if (file_exists($tar_file . $dt['upload'])) {
                        wp_delete_file($tar_file . $dt['upload']);
                        wp_delete_file(str_replace(array($lumise->cfg->upload_url, '/'), array($lumise->cfg->upload_path, TS), $dt['thumbnail_url']));
                    }
                }

                $lumise_admin->delete_row($value, 'categories');

                break;
            default:
                break;
        }
    }
}


// Pagination
$per_page = LW()->session->get($prefix . 'per_page', 20);
if (isset($_POST['per_page'])) {
    $per_page = isset($_POST['per_page']) ? absint($_POST['per_page']) : 20;
    LW()->session->set($prefix . 'per_page', $per_page);
}

// Sortby
if (!empty($_POST['sort'])) {

    $dt_sort = isset($_POST['sort']) ? sanitize_text_field(wp_unslash($_POST['sort'])) : null;
    LW()->session->set($prefix . 'dt_order', $dt_sort);

    $orderby  = null;
    $ordering = null;

    switch ($dt_sort) {

        case 'name_asc':
            $orderby  = 'name';
            $ordering = 'asc';
            break;
        case 'name_desc':
            $orderby  = 'name';
            $ordering = 'desc';
            break;
    }
}

$orderby  = LW()->session->get($prefix . 'orderby', 'name');
$ordering = LW()->session->get($prefix . 'ordering', 'asc');
$dt_order = LW()->session->get($prefix . 'dt_order', 'name_asc');

// Get row pagination
$current_page  = isset($_GET['tpage']) ? $_GET['tpage'] : 1;
$search_filter = array(
    'keyword' => $data_search,
    'fields'  => 'name',
);

$default_filter = array(
    'type' => $type,
);

$start              = ($current_page - 1) * $per_page;
$cate               = $lumise_admin->get_rows('categories', $search_filter, $orderby, $ordering, null, null, null, $type);
$total_record       = $lumise_admin->get_rows_total('categories', $type, 'type');
$cate['total_page'] = ceil($cate['total_count'] / $per_page);

$config = array(
    'current_page' => $current_page,
    'total_record' => $cate['total_count'],
    'total_page'   => $cate['total_page'],
    'limit'        => $per_page,
    'link_full'    => $lumise->cfg->admin_url . 'lumise-page=categories&type=' . $type . '&tpage={page}',
    'link_first'   => $lumise->cfg->admin_url . 'lumise-page=categories&type=' . $type,
);

$lumise_pagination->init($config);

?>

<div class="lumise_wrapper">
    <div class="lumise_content">

        <div class="lumise_header">
            <h2><?php echo esc_html($lumise->lang('Categories')); ?></h2>
            <a href="<?php echo esc_url($lumise->cfg->admin_url . 'lumise-page=category&type=' . $type); ?>" class="add-new lumise-button">
                <i class="fa fa-plus"></i>
                <?php echo esc_html($lumise->lang('Add new category')); ?>
            </a>
            <?php
            $lumise_page = isset($_GET['lumise-page']) ? sanitize_text_field(wp_unslash($_GET['lumise-page'])) : '';
            $type        = isset($_GET['type']) ? sanitize_text_field(wp_unslash($_GET['type'])) : '';
            echo wp_kses_post($lumise_helper->breadcrumb($lumise_page, $type));
            ?>
        </div>
        <div class="lumise_option">
            <div class="left">
                <form action="<?php echo esc_url($lumise->cfg->admin_url . 'lumise-page=categories&type=' . $type); ?>" method="post">
                    <select name="action" class="art_per_page">
                        <option value="none"><?php echo esc_html($lumise->lang('Bulk Actions')); ?></option>
                        <option value="active"><?php echo esc_html($lumise->lang('Active')); ?></option>
                        <option value="deactive"><?php echo esc_html($lumise->lang('Deactive')); ?></option>
                        <option value="delete"><?php echo esc_html($lumise->lang('Delete')); ?></option>
                    </select>
                    <input type="hidden" name="id_action" class="id_action">
                    <input type="hidden" name="do" value="action" />
                    <input type="submit" class="lumise_submit" name="action_submit" value="<?php echo esc_attr($lumise->lang('Apply')); ?>" />
                    <?php wp_nonce_field('lumise_security_form', 'lumise_security_form_nonce'); ?>
                </form>
                <form class="less" action="<?php echo esc_url($lumise->cfg->admin_url . 'lumise-page=categories&type=' . $type); ?>" method="post">
                    <select name="per_page" class="art_per_page" data-action="submit">
                        <option value="none">-- <?php echo esc_html($lumise->lang('Per page')); ?> --</option>
                        <?php
                        $per_pages = array('20', '50', '100', '200');

                        foreach ($per_pages as $val) {

                            if ($val == $per_page) {
                                echo '<option selected="selected">' . $val . '</option>';
                            } else {
                                echo '<option>' . $val . '</option>';
                            }
                        }
                        ?>
                    </select>
                    <?php wp_nonce_field('lumise_security_form', 'lumise_security_form_nonce'); ?>
                </form>
                <form class="less" action="<?php echo esc_url($lumise->cfg->admin_url . 'lumise-page=categories&type=' . $type); ?>" method="post">
                    <select name="sort" class="art_per_page" data-action="submit">
                        <option value="">-- <?php echo esc_html($lumise->lang('Sort by')); ?> --</option>
                        <option value="name_asc" <?php
                                                    if ($dt_order == 'name_asc') {
                                                        echo 'selected';
                                                    }
                                                    ?>><?php echo esc_html($lumise->lang('Name')); ?> A-Z</option>
                        <option value="name_desc" <?php
                                                    if ($dt_order == 'name_desc') {
                                                        echo 'selected';
                                                    }
                                                    ?>><?php echo esc_html($lumise->lang('Name')); ?> Z-A</option>
                    </select>
                    <?php wp_nonce_field('lumise_security_form', 'lumise_security_form_nonce'); ?>
                </form>
            </div>
            <div class="right">
                <form action="<?php echo esc_url($lumise->cfg->admin_url . 'lumise-page=categories&type=' . $type); ?>" method="post">
                    <input class="search" type="search" name="search" class="form-control form_search" placeholder="Search ..." value="<?php echo esc_attr(LW()->session->get($prefix . $type . 'data_search')); ?>">
                    <input class="lumise_submit" type="submit" name="search_cate" value="<?php echo esc_attr($lumise->lang('Search')); ?>">
                    <?php wp_nonce_field('lumise_security_form', 'lumise_security_form_nonce'); ?>
                </form>
            </div>
        </div>
        <?php if (isset($cate['total_count']) && $cate['total_count'] > 0) { ?>
            <div class="lumise_wrap_table">
                <table class="lumise_table lumise_categories">
                    <thead>
                        <tr>
                            <th class="lumise_check">
                                <div class="lumise_checkbox">
                                    <input type="checkbox" id="check_all">
                                    <label for="check_all"><em class="check"></em></label>
                                </div>
                            </th>
                            <th width="40%"><?php echo esc_html($lumise->lang('Name')); ?></th>
                            <th><?php echo esc_html($lumise->lang('Thumbnail')); ?></th>
                            <th><?php echo esc_html($lumise->lang('Status')); ?></th>
                            <th><?php echo esc_html($lumise->lang('Ordering')); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php

                        if (empty($data_search)) {

                            $cate  = $lumise_admin->get_categories_parent($cate['rows']);
                            $start = ($current_page - 1) * $per_page;

                            for ($i = $start; $i < $start + $per_page; $i++) {
                                if (!isset($cate[$i])) {
                                    break;
                                }
                        ?>

                                <tr>
                                    <td class="lumise_check">
                                        <div class="lumise_checkbox">
                                            <input type="checkbox" name="checked[]" class="action_check" value="<?php if (isset($cate[$i]['id'])) echo absint($cate[$i]['id']); ?>" class="action" id="<?php if (isset($cate[$i]['id'])) echo absint($cate[$i]['id']); ?>">
                                            <label for="<?php if (isset($cate[$i]['id'])) {
                                                            echo absint($cate[$i]['id']);
                                                        } ?>"><em class="check"></em></label>
                                        </div>
                                    </td>
                                    <td class="lumise-resource-title">
                                        <a href="<?php echo esc_url($lumise->cfg->admin_url . 'lumise-page=category&type=' . $type . '&id=' . (isset($cate[$i]['id']) ? absint($cate[$i]['id']) : '')); ?>" class="name">
                                            <?php
                                            if (isset($cate[$i]['name'])) {
                                                echo str_repeat('&mdash;', $cate[$i]['lv']) . $cate[$i]['name'];
                                            }
                                            ?>
                                        </a>
                                        <span> - #<?php echo absint($cate[$i]['id']); ?></span>
                                    </td>
                                    <td>
                                        <?php
                                        if (isset($cate[$i]['thumbnail_url']) && !empty($cate[$i]['thumbnail_url'])) {
                                            echo '<img class="lumise-thumbn" src="' . esc_url($cate[$i]['thumbnail_url']) . '">';
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <a href="#" class="lumise_action" data-type="categories" data-action="switch_active" data-status="<?php echo (isset($cate[$i]['active']) ? $cate[$i]['active'] : '0'); ?>" data-id="<?php if (isset($cate[$i]['id'])) {echo absint($cate[$i]['id']);}?>">
                                            <?php
                                            if (isset($cate[$i]['active'])) {
                                                if ($cate[$i]['active'] == 1) {
                                                    echo '<em class="pub">' . esc_html($lumise->lang('active')) . '</em>';
                                                } else {
                                                    echo '<em class="un pub">' . esc_html($lumise->lang('deactive')) . '</em>';
                                                }
                                            }
                                            ?>
                                        </a>
                                    </td>
                                    <td width="1%"><?php echo absint($cate[$i]['order']); ?></td>
                                </tr>

                            <?php
                            }
                        } else {

                            foreach ($cate['rows'] as $value) {
                            ?>
                                <tr>
                                    <td>
                                        <div class="lumise_checkbox">
                                            <input type="checkbox" name="checked[]" class="action_check" value="<?php if (isset($value['id'])) { echo absint($value['id']);}?>" class="action" id="<?php if (isset($value['id'])) {echo absint($value['id']);}?>">
                                            <label for="<?php if(isset($value['id'])) { echo absint($value['id']); }?>"><em class="check"></em></label>
                                        </div>
                                    </td>
                                    <td><a href="<?php echo esc_url($lumise->cfg->admin_url . 'lumise-page=category&id=' . (isset($value['id']) ? absint($value['id']) : '') . '&type=' . $type); ?>" class="name">
                                            <?php
                                            if (isset($value['name'])) {
                                                echo esc_html($value['name']);
                                            }
                                            ?>
                                        </a></td>
                                    <td>
                                        <?php
                                        if (isset($value['thumbnail_url']) && !empty($value['thumbnail_url'])) {
                                            echo '<img src="' . $value['thumbnail_url'] . '">';
                                        }
                                        ?>
                                    </td>
                                    <td>
                                        <a href="#" class="lumise_action" data-type="categories" data-action="switch_active" data-status="<?php echo (isset($value['active']) ? $value['active'] : '0'); ?>" data-id="<?php if (isset($value['id'])) {echo absint($value['id']);}?>">
                                            <?php
                                            if (isset($value['active'])) {
                                                if ($value['active'] == 1) {
                                                    echo '<em class="pub">' . esc_html($lumise->lang('active')) . '</em>';
                                                } else {
                                                    echo '<em class="un pub">' . esc_html($lumise->lang('deactive')) . '</em>';
                                                }
                                            }
                                            ?>
                                        </a>
                                    </td>
                                </tr>
                        <?php
                            }
                        }

                        ?>

                    </tbody>
                </table>
            </div>

            <div class="lumise_pagination"><?php echo wp_kses_post($lumise_pagination->pagination_html()); ?></div>

        <?php
        } else {
            if (isset($total_record) && $total_record > 0) {
                echo '<p class="no-data">' . esc_html($lumise->lang('Apologies, but no results were found.')) . '</p>';
                $type = isset($_GET['type']) ? sanitize_text_field(wp_unslash($_GET['type'])) : '$type';
                LW()->session->set($prefix . $type . 'data_search', null);
                echo '<a href="' . esc_url($lumise->cfg->admin_url) . 'lumise-page=categories&type=' . $type . '" class="btn-back"><i class="fa fa-reply" aria-hidden="true"></i>' . $lumise->lang('Back To Lists') . '</a>';
            } else {
                echo '<p class="no-data">' . $lumise->lang('No data. Please add category.') . '</p>';
            }
        }
        ?>

    </div>
</div>
