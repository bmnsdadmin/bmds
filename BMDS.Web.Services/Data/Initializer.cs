using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace BMDS.Web.Services.Data
{
    public class Initializer: MigrateDatabaseToLatestVersion<BMDSDataContext,Configuration>
    {
    }
}