
import os
import subprocess
import webbrowser
from config import WEB_SEPARATION_URL, WEB_TRADE_URL

# 获取当前文件的绝对路径
current_file_path = os.path.abspath(__file__)

# 获取当前文件所在的目录
current_directory = os.path.dirname(current_file_path)

# 拼接 ./src 路径
src_directory = os.path.join(current_directory, 'src')

def update_and_merge_branches(repo_dir, main_branch, webUrl):
    """
    更新 main 分支，并将其合并到目标分支，然后将目标分支推送到 origin。

    :param repo_dir: 仓库目录
    :param main_branch: 主分支名称，默认为 'main'
    :param target_branch: 目标分支名称，默认为 'justForLanguageTeam'
    """
    # 保存当前工作目录
    original_dir = os.getcwd()
    target_branch = 'justForLanguageTeam'

    try:
        # 进入仓库目录
        os.chdir(repo_dir)

        # 更新 main 分支
        subprocess.run(['git', 'checkout', main_branch], check=True)
        subprocess.run(['git', 'pull', 'origin', main_branch], check=True)

        # 切换到目标分支
        subprocess.run(['git', 'checkout', target_branch], check=True)

        # 合并 main 分支到目标分支
        merge_result = subprocess.run(['git', 'merge', main_branch], check=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if merge_result.returncode != 0:
            print("Merge conflicts detected. Please resolve them manually.")
            print(merge_result.stdout)
            print(merge_result.stderr)
        else:
            # 推送目标分支到 origin
            subprocess.run(['git', 'push', 'origin', target_branch], check=True)

    except subprocess.CalledProcessError as e:
        print(f"An error occurred while running git command: {e}")
    finally:
        webbrowser.open(webUrl)
        # 恢复原来的工作目录
        os.chdir(original_dir)

update_and_merge_branches(os.path.join(current_directory, 'web_separation'), 'master', WEB_SEPARATION_URL)
update_and_merge_branches(os.path.join(current_directory, 'web-trade'), 'main', WEB_TRADE_URL)